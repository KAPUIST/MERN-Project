import OpenAI from "openai";
import ErrorHandler from "../../utils/error.handler";
import ChatRepository from "../repositories/chat.repository";
import { Types } from "mongoose";
import { IChatRoom } from "../schemas/chatRoom.schema";
import { IMessage } from "../schemas/message.schema";
export default class ChatService {
  private openai: OpenAI;
  private chatRepository: ChatRepository;
  constructor(chatRepository: ChatRepository, openai: OpenAI) {
    this.openai = openai;
    this.chatRepository = chatRepository;
  }
  //헬퍼 함수
  private cleanMessageData(message: any) {
    const messageData = message.toObject();
    delete messageData.chatRoomId;
    return messageData;
  }
  // 새로운 채팅방을 생성
  async createChatRoom(email: string): Promise<string> {
    const chatRoomId = await this.chatRepository.createChatRoom(email);
    return chatRoomId;
  }
  async findChatRoomById(chatRoomId: string): Promise<IChatRoom | null> {
    return await this.chatRepository.findChatRoomById(chatRoomId);
  }
  async getUserChatRooms(email: string): Promise<IChatRoom[]> {
    return await this.chatRepository.getAllChatRooms(email);
  }

  async getChatRoomMessages({
    chatRoomId,
    skip,
    limit
  }: {
    chatRoomId: string;
    skip: number;
    limit: number;
  }): Promise<IMessage[]> {
    return await this.chatRepository.getMessagesByChatRoomId({
      chatRoomId,
      skip,
      limit
    });
  }

  async handleUserMessage({ chatRoomId, message }: { chatRoomId: string; message: string }) {
    const savedUserMessage = await this.chatRepository.createMessage({
      chatRoomId,
      message,
      role: "user"
    });
    const aiResponse = await this.getAiResponse(message);

    const savedAiMessage = await this.chatRepository.createMessage({
      chatRoomId,
      message: aiResponse,
      role: "ai"
    });
    const userMessageData = this.cleanMessageData(savedUserMessage);
    const aiMessageData = this.cleanMessageData(savedAiMessage);

    return { chatRoomId, userMessage: userMessageData, aiMessage: aiMessageData };
  }
  private async getAiResponse(message: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      max_tokens: 800,
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `
          너는 고도로 훈련된 자기소개서 첨삭 AI야. 다음과 같은 형식으로 피드백을 제공해줘:
      1. 피드백: 구체적으로 문제점을 설명하고, 왜 수정이 필요한지 논리적으로 서술해.
      2. 수정 후 문장: 수정된 문장을 제시하고, 어떻게 개선했는지 설명해.
      
      예시:
      피드백: [여기에 문제점과 수정 이유를 설명]
      수정 후: [수정된 문장]
          `
        },
        { role: "user", content: message }
      ]
    });

    const aiMessage = response.choices[0].message.content || "AI 응답을 가져오지 못했습니다.";
    if (!aiMessage) {
      throw new ErrorHandler(500, "AI 응답을 생성하는 중 오류가 발생했습니다.");
    }

    return aiMessage;
  }
}
