import postModel from "../models/post";
import { chatSession } from "../models/chatSession";
import { callChefAI } from "../utils/chefaiModel";
import {
    ChefAIFilters,
    PostMatchQuery,
    NotRegexCondition
} from "../types/chefai";
import { getCategories } from "./post";

export const createSession = async () => {
    return await chatSession.create({ messages: [] });
};

export const getSessionById = async (id: string) => {
    return await chatSession.findById(id);
};

export const appendUserMessage = async (sessionId: string, message: string) => {
    return await chatSession.findByIdAndUpdate(
        sessionId,
        { $push: { messages: { role: "user", content: message } } },
        { new: true }
    );
};

export const appendAssistantMessage = async (sessionId: string, content: string) => {
    return await chatSession.findByIdAndUpdate(
        sessionId,
        { $push: { messages: { role: "assistant", content } } },
        { new: true }
    );
};

export const processChefAI = async (sessionId: string, message: string) => {
    const session = await chatSession.findById(sessionId);
    if (!session) return null;

    const categories = await getCategories();

    const aiResponse = await callChefAI(
        message,
        session.messages.map(m => ({ role: m.role, content: m.content })),
        categories
    );

    if (aiResponse.intent !== "search_recipes") {
        await appendAssistantMessage(sessionId, JSON.stringify(aiResponse));
    }

    return aiResponse;
};

export const searchPosts = async (
    currentUserId: string,
    filters: ChefAIFilters,
    skip?: number,
    limit?: number
) => {
    const match: PostMatchQuery = {};
    const andConditions: PostMatchQuery["$and"] = [];

    // Title keyword search
    if (filters.keywords && filters.keywords.length > 0) {
        match.title = {
            $regex: filters.keywords.join("|"),
            $options: "i"
        };
    }

    // Category → dedicated category field
    if (filters.category) {
        match.category = {
            $regex: filters.category,
            $options: "i"
        };
    }

    // Time → numeric filter (under X minutes)
    if (filters.time !== null && filters.time !== undefined) {
        match.time = { $lte: filters.time };
    }

    // Ingredients include → each ingredient must match at least one array element
    if (filters.ingredientsInclude && filters.ingredientsInclude.length > 0) {
        for (const word of filters.ingredientsInclude) {
            andConditions.push({
                ingredients: {
                    $elemMatch: {
                        $regex: word,
                        $options: "i"
                    }
                }
            });
        }
    }

    // Ingredients exclude → no array element should match these words
    if (filters.ingredientsExclude && filters.ingredientsExclude.length > 0) {
        for (const word of filters.ingredientsExclude) {
            andConditions.push({
                ingredients: {
                    $not: new RegExp(word, "i")
                } as NotRegexCondition
            });
        }
    }

    if (andConditions.length > 0) {
        match.$and = andConditions;
    }

    console.log(JSON.stringify(match, null, 2));

    return await postModel.getPosts(currentUserId, match, skip, limit);
};
