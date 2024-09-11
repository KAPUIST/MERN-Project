import { Schema, Document, model } from "mongoose";

export interface IMessage extends Document {
  chatRoomId: Schema.Types.ObjectId;
  role: "user" | "ai";
  message: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

const Message = model<IMessage>("Message", messageSchema);

export default Message;
