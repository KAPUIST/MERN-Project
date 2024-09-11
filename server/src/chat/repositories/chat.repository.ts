import { Model } from "mongoose";
import ChatRoom, { IChatRoom } from "../schemas/chatRoom.schema";
import { IMessage } from "../schemas/message.schema";

export default class ChatRepository {
  private chatModel: Model<IChatRoom>;
  private messageModel: Model<IMessage>;
  constructor(chatModel: Model<IChatRoom>, messageModel: Model<IMessage>) {
    this.chatModel = chatModel;
    this.messageModel = messageModel;
  }

  // 새로운 대화 생성
  async createChatRoom(email: string): Promise<string> {
    const createChatRoom = new this.chatModel({
      email,
      createdAt: new Date()
    });
    const chatRoom = await createChatRoom.save();
    return chatRoom._id.toString();
  }

  //메시지 작성 하기입니당.
  async createMessage({
    chatRoomId,
    role,
    message
  }: {
    chatRoomId: string;
    role: "user" | "ai";
    message: string;
  }): Promise<IMessage> {
    const createMessage = new this.messageModel({
      chatRoomId,
      role,
      message,
      createdAt: new Date()
    });
    const newMessage = await createMessage.save();
    return newMessage;
  }
  // 채팅방 ID로 채팅방 찾기
  async findChatRoomById(chatRoomId: string): Promise<IChatRoom | null> {
    return await this.chatModel.findById(chatRoomId).exec();
  }

  // 모든 채팅방 리스트 조회 (옵션: 특정 사용자의 채팅방만 조회)
  async getAllChatRooms(email?: string): Promise<IChatRoom[]> {
    if (email) {
      return await this.chatModel.find({ email }).exec();
    }
    return await this.chatModel.find().exec();
  }

  // 특정 채팅방의 메시지 리스트 가져오기
  async getMessagesByChatRoomId(chatRoomId: string): Promise<IMessage[]> {
    return await this.messageModel.find({ chatRoomId }).sort({ createdAt: 1 }).exec();
  }
}
