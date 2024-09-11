import { Schema, model, Document } from "mongoose";

export interface IChatRoom extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  createdAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>(
  {
    email: {
      type: String,
      ref: "User",
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

const ChatRoom = model<IChatRoom>("ChatRoom", chatRoomSchema);

export default ChatRoom;
