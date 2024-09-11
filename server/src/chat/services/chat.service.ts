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

  async getChatRoomMessages(chatRoomId: string): Promise<IMessage[]> {
    return await this.chatRepository.getMessagesByChatRoomId(chatRoomId);
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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          너는 자기소개서를 첨삭하는 AI야. 다음과 같은 형식으로 수정 사항과 피드백을 제공해야 해:
          
  
          1. 피드백: 수정 이유, 어떤 문제를 발견했고, 어떻게 수정했는지 설명.
          이렇게 원본 문장과 수정된 문장을 비교하면서 피드백을 제공해.
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
