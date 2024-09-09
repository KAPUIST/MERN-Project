import mongoose, { Schema, Document, Types } from "mongoose";

interface IMessage {
  question: string;
  response: string;
  date: Date;
}

export interface IConversation extends Document {
  _id: Types.ObjectId;
  email: string;
  messages: IMessage[];
}

const ConversationSchema: Schema = new Schema({
  email: { type: String, ref: "User", required: true },
  messages: [
    {
      question: { type: String, required: true },
      response: { type: String, default: "" },
      date: { type: Date, default: Date.now }
    }
  ]
});

export const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
