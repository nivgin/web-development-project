import env from './utils/env'
import { createApp } from "./server/server";
import http from 'http';
import https from 'https';
import fs from 'fs';

const startApp = async () => {
    const app = await createApp();

    if (env.NODE_ENV !== 'production') {
        console.log('DEV')
        http.createServer(app).listen(env.PORT);
    } else {
        const sslOptions = {
            key: fs.readFileSync('../client-key.pem'),
            cert: fs.readFileSync('../client-cert.pem')
        };
        console.log('PROD')
        https.createServer(sslOptions, app).listen(env.HTTPS_PORT);
    }
}

startApp();
