import supertest from "supertest";
import mongoose from "mongoose";
import TestAgent from "supertest/lib/agent";
import { createApp, Mode, TestableApplication } from "../server/server";
import userModel from "../models/user";
import { verifyRefreshToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";

jest.mock("google-auth-library", () => ({
    OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn().mockResolvedValue({
            getPayload: () => ({
                sub: "google-sub-123",
                email: "googleuser@gmail.com",
                name: "Google User",
                picture: "https://example.com/pic.jpg",
            }),
        }),
    })),
}));

let app: TestableApplication;
let request: TestAgent;
let accessToken: string = '';
let refreshToken: string = '';

const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "testpassword123",
    pfpUrl: "image.png"
};

const badTestUser = {
    username: "testuser",
    email: "testuser@example.com",
    pfpUrl: "image.png"
};

beforeAll(async () => {
    app = await createApp(Mode.TEST)
    request = supertest(app);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (app.close) {
        await app.close()
    }
});

describe("Restric Access without Auth / ", () => {
    it("should return 401 when missing Auth", async () => {
        await request.get("/api/post").expect(401);
        await request.get("/api/comment").expect(401);
        await request.get("/api/user").expect(401);
    });
})

describe("Register", () => {
    it("Add new user", async () => {
        const response = await request.post("/api/auth/register").send(testUser).expect(200);
        expect(response.body).toBeDefined();
        expect(response.body._id).toBeDefined();
        const createdUser = await userModel.findById(response.body._id);
        expect(createdUser).toBeTruthy();
    });

    it("Recreate existing User", async () => {
        await request.post("/api/auth/register").send(testUser).expect(400);
    });

    it("Add new user without body", async () => {
        await request.post("/api/auth/register").expect(400);
    });

    it("Add new user without some fields", async () => {
        await request.post("/api/auth/register").send(badTestUser).expect(400);
    });
})

describe("Login", () => {
    it("Login User", async () => {
        const response = await request.post("/api/auth/login").send(testUser).expect(200);
        expect(response.body).toBeDefined();
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        const user = await verifyRefreshToken(refreshToken);
        expect(user).toBeDefined();
    });

    it("Login User without credentials", async () => {
        await request.post("/api/auth/login").expect(400);
    });

    it("Login User with bad credentials", async () => {
        await request.post("/api/auth/login").send(badTestUser).expect(400);
    });
})

describe("Token Access", () => {
    it("Authorized Access", async () => {
        await request.get("/api/post").set({authorization: `JWT ${accessToken}`}).expect(200);
    });
    it("Unauthorized Access", async () => {
        await request.get("/api/post").expect(401);
    });
    it("Bad Token", async () => {
        await request.get("/api/post").set({authorization: `JWT randomstringvalue123`}).expect(403);
    });
})

describe("Token expirey and rotation", () => {
    jest.setTimeout(120000);
    it("Timeout Access", async () => {
        await new Promise(r => setTimeout(r, 61*1000)); // Decrease the `JWT_TOKEN_EXPIRATION` env var to 1m for testing.
        await request.get("/api/post").set({authorization: `JWT ${accessToken}`}).expect(403);
    });
    it("Refresh Token without Auth", async () => {
        await request.post("/api/auth/refreshToken").expect(401); 
    });

    it("Refresh Token", async () => {
        const response = await request.post("/api/auth/refreshToken").set({authorization: `JWT ${refreshToken}`}).expect(200);
        expect(response.body).toBeDefined();
        const oldRefreshToken = refreshToken;
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        const user = await verifyRefreshToken(refreshToken);
        expect(user.tokens.includes(refreshToken)).toBeTruthy();
        expect(user.tokens.includes(oldRefreshToken)).toBeFalsy();
        await request.get("/api/post").set({authorization: `JWT ${accessToken}`}).expect(200);
    });
})

describe("Logout", () => {
    it("Logout a User", async () => {
        await request.post("/api/auth/logout").set({authorization: `JWT ${accessToken}`}).send({ refreshToken: refreshToken }).expect(200);
    });
    it("Logout with bad token", async () => {
    await request.post("/api/auth/logout").set({authorization: `JWT ${accessToken}`}).send({ refreshToken: null }).expect(401);
    });  
    it("Logout without token", async () => {
    await request.post("/api/auth/logout").set({authorization: `JWT ${accessToken}`}).expect(400);
    });
})

describe("Google Auth", () => {
    it("should login and return tokens for a new Google user", async () => {
        const response = await request.post("/api/auth/google").send({ idToken: "mock-id-token" }).expect(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();

        const user = await userModel.findOne({ email: "googleuser@gmail.com" });
        expect(user).toBeTruthy();
        expect(user?.googleId).toBe("google-sub-123");
    });

    it("should return existing user tokens on repeated Google login", async () => {
        await request.post("/api/auth/google").send({ idToken: "mock-id-token" }).expect(200);
        const response = await request.post("/api/auth/google").send({ idToken: "mock-id-token" }).expect(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();

        const users = await userModel.find({ email: "googleuser@gmail.com" });
        expect(users.length).toBe(1);
    });

    it("should return 400 when idToken is missing", async () => {
        const response = await request.post("/api/auth/google").send({}).expect(400);
        expect(response.text).toBe("Missing ID token");
    });

    it("should return 400 when Google token verification fails", async () => {
        const mockInstance = jest.mocked(OAuth2Client).mock.results[0].value;
        mockInstance.verifyIdToken.mockRejectedValueOnce(new Error("Token invalid"));

        const response = await request.post("/api/auth/google").send({ idToken: "bad-token" }).expect(400);
        expect(response.text).toBe("Google authentication failed");
    });

    it("should return 400 when Google payload has no sub", async () => {
        const mockInstance = jest.mocked(OAuth2Client).mock.results[0].value;
        mockInstance.verifyIdToken.mockResolvedValueOnce({
            getPayload: () => ({ email: "googleuser@gmail.com" }),
        });

        const response = await request.post("/api/auth/google").send({ idToken: "mock-id-token" }).expect(400);
        expect(response.text).toBe("Invalid Google token");
    });
});