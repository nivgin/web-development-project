import supertest from "supertest";
import mongoose from "mongoose";
import TestAgent from "supertest/lib/agent";
import env from "../utils/env";
import { createApp, Mode, TestableApplication } from "../server/server";
import path from "path";

let app: TestableApplication;
let request: TestAgent;
let accessToken: string = '';

const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "hashedpassword",
    pfpUrl: "image.png"
};

beforeAll(async () => {
    app = await createApp(Mode.TEST);
    request = supertest(app);
    
    await request.post("/api/auth/register").send(testUser);
    const loggedInUser = await request.post("/api/auth/login").send(testUser);
    accessToken = loggedInUser.body.accessToken;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (app.close) {
        await app.close()
    }
});

describe("File Tests", () => { 
    it("upload file", async () => { 
        const filePath = path.join(__dirname, "test.jpg"); 
        const response = await request.post("/api/file")
        .set({authorization: `JWT ${accessToken}`})
        .attach("file", filePath)
        .expect(200);
        expect(response.body.url).toBeDefined(); 
        let url: string = response.body.url; 
        url = url.replace(/^.*\/\/[^/]+/, ""); 
        await request.get(url).expect(200);
    });

    it("fails when no file uploaded", async () => {
        const response = await request.post("/api/file")
            .set({ authorization: `JWT ${accessToken}` })
            .expect(400);

        expect(response.body.error).toBe("No file uploaded");
    });

    it("returns url with HTTPS port in production", async () => {
        const originalEnv = env.NODE_ENV;
        env.HTTPS_PORT = "443";
        env.NODE_ENV = "production";

        const filePath = path.join(__dirname, "test.jpg");
        const response = await request
            .post("/api/file")
            .set({ authorization: `JWT ${accessToken}` })
            .attach("file", filePath)
            .expect(200);

        expect(response.body.url).toContain(env.HTTPS_PORT);

        env.NODE_ENV = originalEnv;
    });
});
