import express, { Application } from "express";
import cors from 'cors';
import { dbConnection } from "../utils/db";
import { createMongoMemoryDatabase } from "../tests/testUtils";
import bodyParser from "body-parser";

import postRouter from "../routes/post";
import commentRouter from "../routes/comment";
import userRouter from "../routes/user";
import authRouter from "../routes/auth";
import fileRouter from "../routes/file"
import authenticate from "../middlewares/authenticate";
import chefaiRouter from "../routes/chefai";

export enum Mode {
  PROD = 'production',
  TEST = 'test',
}

export interface TestableApplication extends Application {
  close?: () => Promise<void>;
}

export const createApp = async (appMmode?: Mode) => {
    const mode = appMmode || Mode.PROD;
    const app: TestableApplication = express();

    if (mode == Mode.PROD) {    
        dbConnection();
    } else {
        const testMongoServer = await createMongoMemoryDatabase();

        app.close = async () => {
            await testMongoServer.stop()
        }
    }

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', '*');
        next();
    });
    app.use('/public', express.static('public'));
    app.use('/api/auth', authRouter)
    app.use('/api/post', authenticate, postRouter);
    app.use('/api/comment', authenticate, commentRouter)
    app.use('/api/user', authenticate, userRouter);
    app.use('/api/chefai', authenticate, chefaiRouter)
    app.use('/api/file', fileRouter)

    app.get('/{*path}', (req, res) => {
        if (/\.\w+$/.test(req.path)) {
            res.sendFile(req.path, { root: 'public' });
        } else {
            res.sendFile('index.html', { root: 'public' });
        }
    });

    return app;
}