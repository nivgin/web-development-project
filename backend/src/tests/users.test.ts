import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import userModel from "../models/user";
import TestAgent from "supertest/lib/agent";
import { createApp, Mode, TestableApplication } from "../server/server";

let app: TestableApplication;
let request: TestAgent;
let accessToken: string = '';
let userId: string = '';
let userCounter: number = 0;

// Test data
const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "testpassword123",
    pfpUrl: "image.png"
};

const testUser2 = {
    username: "testuser2",
    email: "testuser2@example.com",
    password: "testpassword456",
    pfpUrl: "image2.png"
};

beforeAll(async () => {
    app = await createApp(Mode.TEST)
    request = supertest(app);
    
    // Create test user
    const registerUser = await request.post("/api/auth/register").send(testUser);
    userId = registerUser.body._id.toString();
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

// Helper function to create a user with hashed password
const createUserWithHashedPassword = async (userData: { username: string; email: string; password: string, pfpUrl: string }) => {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    return await userModel.create({
        username: userData.username,
        email: userData.email,
        passwordHash: passwordHash,
        pfpUrl: userData.pfpUrl
    });
};

// Helper function to create and authenticate a unique user
const createAuthenticatedUser = async () => {
    userCounter++;
    const newUser = {
        username: `user_${userCounter}`,
        email: `user_${userCounter}@example.com`,
        password: "testpassword123",
        pfpUrl: `image_${userCounter}.png`
    };
    const registerUser = await request.post("/api/auth/register").send(newUser);
    const userId = registerUser.body._id.toString();
    const loggedInUser = await request.post("/api/auth/login").send(newUser);
    const accessToken = loggedInUser.body.accessToken;
    return { userId, accessToken };
};

describe("User Routes", () => {
    
    describe("GET /user", () => {
        beforeEach(async () => {
            // Create some test users
            await createUserWithHashedPassword(testUser2);
        });
        
        it("should return all users", async () => {
            const response = await request
                .get("/api/user")
                .set({authorization: `JWT ${accessToken}`})
                .expect(200);
                
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });
    });
    
    describe("GET /user/:id", () => {
        
        it("should return user by valid ID", async () => {
            const response = await request
                .get(`/api/user/${userId}`)
                .set({authorization: `JWT ${accessToken}`})
                .expect(200);
                
            expect(response.body).toBeDefined();
            expect(response.body._id).toBe(userId);
        });
        
        it("should return user by valid username", async () => {
            const response = await request
                .get(`/api/user/${testUser.username}`)
                .set({authorization: `JWT ${accessToken}`})
                .expect(200);
                
            expect(response.body).toBeDefined();
            expect(response.body._id).toBe(userId);
            expect(response.body.username).toBe(testUser.username);
        });
        
        it("should return 404 for non-existent username", async () => {
            const response = await request
                .get("/api/user/nonexistentuser")
                .set({authorization: `JWT ${accessToken}`})
                .expect(404);
                
            expect(response.text).toBe("User Not Found");
        });
        
        it("should return 404 for non-existent user ID", async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            
            const response = await request
                .get(`/api/user/${nonExistentId}`)
                .set({authorization: `JWT ${accessToken}`})
                .expect(404);
                
            expect(response.text).toBe("User Not Found");
        });
    });
    
    describe("PATCH /user/:id", () => {
        let testUserId: string;
        let testUserAccessToken: string;
        
        beforeEach(async () => {
            // Create a fresh user for each test
            await userModel.deleteMany({});
            const result = await createAuthenticatedUser();
            testUserId = result.userId;
            testUserAccessToken = result.accessToken;
        });
        
        it("should update username successfully", async () => {
            const updatedUsername = "updatedusername";
            
            const response = await request
                .patch(`/api/user/${testUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .send({ username: updatedUsername })
                .expect(200);
                
            expect(response.body).toBeDefined();
            expect(response.body._id).toBe(testUserId);
            expect(response.body.username).toBe(updatedUsername);
            
            const updatedUser = await userModel.findById(testUserId);
            expect(updatedUser?.username).toBe(updatedUsername);
        });
        
        it("should update user password successfully", async () => {
            const newPassword = "newpassword123";
            
            const response = await request
                .patch(`/api/user/${testUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .send({ password: newPassword })
                .expect(200);
                
            expect(response.body).toBeDefined();
            expect(response.body._id).toBe(testUserId);
            
            const updatedUser = await userModel.findById(testUserId);
            expect(await bcrypt.compare(newPassword, updatedUser?.passwordHash || "")).toBe(true);
        });
        
        it("should return 400 for invalid user ID format", async () => {
            const response = await request
                .patch("/api/user/invalid-id")
                .set({authorization: `JWT ${testUserAccessToken}`})
                .send({ email: "updated@example.com" })
                .expect(400);
                
            expect(response.text).toBe("Invalid User Id");
        });
        
        it("should return 400 when body is missing", async () => {
            const response = await request
                .patch(`/api/user/${testUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .expect(400);
                
            expect(response.text).toBe("Missing Body");
        });
        
        it("should return 400 when trying to update email", async () => {
            const response = await request
                .patch(`/api/user/${testUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .send({ email: "newemail@example.com" })
                .expect(400);
                
            expect(response.text).toBe("Email cannot be updated");
        });
        
        it("should return 400 when username already exists", async () => {
            await createUserWithHashedPassword(testUser2);
            
            const response = await request
                .patch(`/api/user/${testUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .send({ username: testUser2.username })
                .expect(400);
                
            expect(response.text).toBe("Username already exists");
        });
        
        it("should return 400 for non-existent user ID (authorization check first)", async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            
            const response = await request
                .patch(`/api/user/${nonExistentId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .send({ email: "updated@example.com" })
                .expect(400);
                
            expect(response.text).toBe("Unauthorized");
        });
        
        it("Block user from editing other user's data", async () => {
            const otherUser = await createUserWithHashedPassword(testUser2);
            const otherUserId = otherUser._id.toString();
            
            const response = await request
                .patch(`/api/user/${otherUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .send({ email: "unauthorized@example.com" })
                .expect(400);
                
            expect(response.text).toBe("Unauthorized");
        });
    });
    
    describe("DELETE /user/:id", () => {
        let testUserId: string;
        let testUserAccessToken: string;
        
        beforeEach(async () => {
            await userModel.deleteMany({});
            const result = await createAuthenticatedUser();
            testUserId = result.userId;
            testUserAccessToken = result.accessToken;
        });
        
        it("should delete user successfully", async () => {
            const response = await request
                .delete(`/api/user/${testUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .expect(200);
                
            expect(response.body).toBeDefined();
            expect(response.body._id).toBe(testUserId);
            
            const deletedUser = await userModel.findById(testUserId);
            expect(deletedUser).toBeNull();
        });
        
        it("should return 400 for invalid user ID format", async () => {
            const response = await request
                .delete("/api/user/invalid-id")
                .set({authorization: `JWT ${testUserAccessToken}`})
                .expect(400);
                
            expect(response.text).toBe("Invalid User Id");
        });
        
        it("should return 400 for non-existent user ID (authorization check first)", async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            
            const response = await request
                .delete(`/api/user/${nonExistentId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .expect(400);
                
            expect(response.text).toBe("Unauthorized");
        });
        
        it("Block user from deleting other user", async () => {
            const otherUser = await createUserWithHashedPassword(testUser2);
            const otherUserId = otherUser._id.toString();
            
            const response = await request
                .delete(`/api/user/${otherUserId}`)
                .set({authorization: `JWT ${testUserAccessToken}`})
                .expect(400);
                
            expect(response.text).toBe("Unauthorized");
        });
    });
});