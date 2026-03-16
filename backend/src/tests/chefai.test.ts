import supertest from "supertest";
import mongoose from "mongoose";
import TestAgent from "supertest/lib/agent";
import { createApp, Mode, TestableApplication } from "../server/server";
import { chatSession } from "../models/chatSession";
import postModel from "../models/post";
import * as chefaiModel from "../utils/chefaiModel";
import type { IPostDTO } from "../models/post";

let app: TestableApplication;
let request: TestAgent;
let accessToken: string = '';
let userId: string = '';

const testUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "hashedpassword",
    pfpUrl: "image.png"
};

const testPost = {
    title: "Lemon Pancakes",
    content: "A delicious lemon pancake recipe.",
    imageUrl: "lemon-pancakes.png",
    ingredients: ["lemon", "flour", "egg", "milk"],
    instructions: ["Mix ingredients.", "Cook on pan."],
    servings: 2,
    time: 15,
    category: "Breakfast"
};

beforeAll(async () => {
    app = await createApp(Mode.TEST);
    request = supertest(app);

    const registerUser = await request.post("/auth/register").send(testUser);
    userId = registerUser.body._id.toString();
    const loggedInUser = await request.post("/auth/login").send(testUser);
    accessToken = loggedInUser.body.accessToken;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (app.close) {
        await app.close();
    }
});

beforeEach(async () => {
    await chatSession.deleteMany({});
    await postModel.deleteMany({});
    jest.restoreAllMocks();
});

describe("ChefAI - search_recipes", () => {
    it("should create a new session and return search results", async () => {
        await postModel.create({ ...testPost, sender: userId });

        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: ["lemon"],
                    category: null,
                    time: null,
                    ingredientsInclude: null,
                    ingredientsExclude: null,
                    servings: null
                }
            }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a lemon recipe" })
            .expect(200);

        expect(response.body.sessionId).toBeDefined();
        expect(response.body.intent).toBe("search_recipes");
        expect(Array.isArray(response.body.results)).toBe(true);
    });

    it("should reuse existing session", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: null,
                    category: null,
                    time: null,
                    ingredientsInclude: null,
                    ingredientsExclude: null,
                    servings: null
                }
            }
        });

        const first = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find recipes" })
            .expect(200);

        const sessionId = first.body.sessionId;

        const second = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ sessionId, message: "find more recipes" })
            .expect(200);

        expect(second.body.sessionId).toBe(sessionId);
    });

    it("should save search results into session messages", async () => {
        await postModel.create({ ...testPost, sender: userId });

        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: ["lemon"],
                    category: null,
                    time: null,
                    ingredientsInclude: null,
                    ingredientsExclude: null,
                    servings: null
                }
            }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a lemon recipe" })
            .expect(200);

        const session = await chatSession.findById(response.body.sessionId);
        const assistantMessages = session?.messages.filter(m => m.role === "assistant");
        expect(assistantMessages?.length).toBeGreaterThan(0);
        expect(assistantMessages?.[0].content).toContain("I found the following recipes");
    });
});

describe("ChefAI - modify_recipe", () => {
    it("should return a modified recipe", async () => {
        const modifiedRecipe = {
            id: new mongoose.Types.ObjectId().toString(),
            title: "Banana Pancakes",
            description: "Pancakes with banana slices instead of chocolate chips.",
            image: "pancakes.png",
            category: "Breakfast",
            time: "15",
            servings: 2,
            ingredients: ["banana", "flour", "egg", "milk"],
            instructions: ["Slice bananas.", "Mix ingredients.", "Cook on pan."],
            aiGenerated: true
        };

        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "modify_recipe",
            data: { recipe: modifiedRecipe }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "replace chocolate chips with banana slices" })
            .expect(200);

        expect(response.body.intent).toBe("modify_recipe");
        expect(response.body.recipe.title).toBe("Banana Pancakes");
        expect(response.body.recipe.aiGenerated).toBe(true);
    });
});

describe("ChefAI - general_question", () => {
    it("should return an answer to a general question", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "general_question",
            data: { answer: "You can substitute butter with coconut oil." }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "can I substitute butter with something?" })
            .expect(200);

        expect(response.body.intent).toBe("general_question");
        expect(response.body.answer).toBe("You can substitute butter with coconut oil.");
    });
});

describe("ChefAI - error handling", () => {
    it("should return 500 when AI processing fails", async () => {
        jest.spyOn(chatSession, "findById").mockResolvedValueOnce(null);

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a recipe" })
            .expect(500);

        expect(response.body.error).toBe("AI processing failed");
    });

    it("should return 400 for unknown intent", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "unknown_intent",
            data: {}
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a recipe" })
            .expect(400);

        expect(response.body.error).toBe("Unknown intent");
    });
});

describe("ChefAI - searchPosts filters", () => {
    beforeEach(async () => {
        await postModel.deleteMany({});
        await postModel.create([
            {
                title: "Lemon Tart",
                content: "A fresh lemon tart.",
                imageUrl: "lemon-tart.png",
                ingredients: ["lemon", "butter", "egg", "flour"],
                instructions: ["Mix ingredients.", "Bake."],
                servings: 4,
                time: 20,
                category: "Dessert",
                sender: userId
            },
            {
                title: "Quick Pasta",
                content: "A quick pasta recipe.",
                imageUrl: "pasta.png",
                ingredients: ["pasta", "tomato", "garlic"],
                instructions: ["Boil pasta.", "Add sauce."],
                servings: 2,
                time: 10,
                category: "Dinner",
                sender: userId
            },
            {
                title: "Banana Pancakes",
                content: "Fluffy banana pancakes.",
                imageUrl: "pancakes.png",
                ingredients: ["banana", "flour", "egg", "milk"],
                instructions: ["Mix.", "Cook on pan."],
                servings: 2,
                time: 15,
                category: "Breakfast",
                sender: userId
            }
        ]);
    });

    it("should filter by time", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: null,
                    category: null,
                    time: 10,
                    ingredientsInclude: null,
                    ingredientsExclude: null,
                    servings: null
                }
            }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a recipe under 10 minutes" })
            .expect(200);

        expect(response.body.results.length).toBe(1);
        expect(response.body.results[0].title).toBe("Quick Pasta");
    });

    it("should filter by ingredientsInclude", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: null,
                    category: null,
                    time: null,
                    ingredientsInclude: ["lemon"],
                    ingredientsExclude: null,
                    servings: null
                }
            }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a recipe with lemon" })
            .expect(200);

        expect(response.body.results.length).toBe(1);
        expect(response.body.results[0].title).toBe("Lemon Tart");
    });

    it("should filter by ingredientsExclude", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: null,
                    category: null,
                    time: null,
                    ingredientsInclude: null,
                    ingredientsExclude: ["egg"],
                    servings: null
                }
            }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a recipe without egg" })
            .expect(200);

        expect(response.body.results.every((r: IPostDTO) => !r.ingredients.includes("egg"))).toBe(true);
        expect(response.body.results.length).toBe(1);
        expect(response.body.results[0].title).toBe("Quick Pasta");
    });

    it("should filter by category", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: null,
                    category: "Breakfast",
                    time: null,
                    ingredientsInclude: null,
                    ingredientsExclude: null,
                    servings: null
                }
            }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "find me a breakfast recipe" })
            .expect(200);

        expect(response.body.results.length).toBe(1);
        expect(response.body.results[0].title).toBe("Banana Pancakes");
    });

    it("should return all posts when no filters are set", async () => {
        jest.spyOn(chefaiModel, "callChefAI").mockResolvedValue({
            intent: "search_recipes",
            data: {
                filters: {
                    keywords: null,
                    category: null,
                    time: null,
                    ingredientsInclude: null,
                    ingredientsExclude: null,
                    servings: null
                }
            }
        });

        const response = await request
            .post("/chefai")
            .set({ authorization: `JWT ${accessToken}` })
            .send({ message: "show me all recipes" })
            .expect(200);

        expect(response.body.results.length).toBe(3);
    });
});