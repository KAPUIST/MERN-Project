import { Model } from "mongoose";

import { IConversation } from "../schemas/conversation.shchema";
export default class ConversationRepository {
  private conversationModel: Model<IConversation>;
  constructor(conversationModel: Model<IConversation>) {
    this.conversationModel = conversationModel;
  }
  // 유저 ID로 대화 찾기
  async findByEmail(email: string): Promise<IConversation | null> {
    return this.conversationModel.findOne({ email }).exec();
  }
  // 유저 ID로 대화 찾기
  async findById(conversationId: string): Promise<IConversation | null> {
    return this.conversationModel.findOne({ _id: conversationId }).exec();
  }

  // 대화 저장
  async save(conversation: IConversation): Promise<IConversation> {
    return conversation.save();
  }
  // 새로운 대화 생성
  async create(conversationData: Partial<IConversation>): Promise<IConversation> {
    const newConversation = new this.conversationModel(conversationData);
    return await newConversation.save();
  }
}
