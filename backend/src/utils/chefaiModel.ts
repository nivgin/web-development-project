import OpenAI from "openai";
import { CHEF_AI_PROMPT } from "./prompts";
import env from "./env";

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: env.OPENAI_API_KEY
});

export async function callChefAI(
    userMessage: string,
    history: ChatMessage[] = [],
    categories: string[] = [],
    hasRecipes: boolean = false
) {
    const prompt = CHEF_AI_PROMPT
    .replace("{{CATEGORIES}}", categories.join(", "))
    .replace("{{HAS_RECIPES}}", hasRecipes ? "true" : "false");

    const messages = [
        { role: "system" as const, content: prompt },
        ...history,
        { role: "user" as const, content: userMessage }
    ];

    const completion = await client.chat.completions.create({
        model: "Qwen/Qwen2.5-7B-Instruct:together",
        messages,
        temperature: 0.2,
        max_tokens: 500
    });

    const content = completion.choices[0]?.message?.content ?? "{}";

    try {
        return JSON.parse(content);
    } catch {
        throw new Error("Failed to parse AI JSON response: " + content);
    }
}