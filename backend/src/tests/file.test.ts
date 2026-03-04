import supertest from "supertest";
import mongoose from "mongoose";
import TestAgent from "supertest/lib/agent";
import { createApp, Mode, TestableApplication } from "../server/server";
import path from "path";

let app: TestableApplication;
let request: TestAgent;
let accessToken: string = '';

const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "hashedpassword"
};

beforeAll(async () => {
    app = await createApp(Mode.TEST);
    request = supertest(app);
    
    await request.post("/auth/register").send(testUser);
    const loggedInUser = await request.post("/auth/login").send(testUser);
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
        try { 
            const response = await request.post("/file")
            .set({authorization: `JWT ${accessToken}`})
            .attach("file", filePath)
            .expect(200);
            expect(response.body.url).toBeDefined(); 
            let url: string = response.body.url; 
            url = url.replace(/^.*\/\/[^/]+/, ""); 
            await request.get(url).expect(200);
        } catch (err) { 
            console.error(err); expect(1).toBe(2);
        } 
    }); 
});
