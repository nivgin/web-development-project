import { Schema, model, Document } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChatSession extends Document {
  userId?: string;
  messages: IChatMessage[];
  hasRecipes: boolean;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: String },
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true }
      }
    ],
    hasRecipes: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const chatSession = model<IChatSession>("chatSession", ChatSessionSchema);