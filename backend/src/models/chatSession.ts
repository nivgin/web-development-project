import { Schema, model, Document } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IChatSession extends Document {
  userId?: string;
  messages: IChatMessage[];
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    userId: { type: String },
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export const chatSession = model<IChatSession>("chatSession", ChatSessionSchema);