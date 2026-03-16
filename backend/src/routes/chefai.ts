import express from "express";
import {
    createSession,
    getSessionById,
    appendUserMessage,
    appendAssistantMessage,
    processChefAI,
    searchPosts,
    foundRecipes
} from "../controllers/chefai";

const chefaiRouter = express.Router();

chefaiRouter.post("/", async (req, res) => {
    const { sessionId, message } = req.body;
    const currentUserId = req.user!._id;

    let session = sessionId ? await getSessionById(sessionId) : null;

    if (!session) {
        session = await createSession();
    }

    await appendUserMessage(session.id, message);

    const aiResponse = await processChefAI(session.id, message);

    if (!aiResponse) {
        return res.status(500).send({ error: "AI processing failed" });
    }

    if (aiResponse.intent === "search_recipes") {
        const results = await searchPosts(
            currentUserId,
            aiResponse.data.filters,
            0,
            5
        );

        if (results.length > 0) {
            foundRecipes(session.id, true)
        }

        await appendAssistantMessage(
            session.id,
            JSON.stringify({
                intent: "search_recipes",
                data: { results }
            })
        );

        return res.status(200).send({
            sessionId: session.id,
            intent: "search_recipes",
            results
        });
    }

    if (aiResponse.intent === "modify_recipe") {
        return res.status(200).send({
            sessionId: session.id,
            intent: "modify_recipe",
            recipe: aiResponse.data.recipe
        });
    }

    if (aiResponse.intent === "general_question") {
        return res.status(200).send({
            sessionId: session.id,
            intent: "general_question",
            answer: aiResponse.data.answer
        });
    }

    res.status(400).send({ error: "Unknown intent" });
});

export = chefaiRouter;
