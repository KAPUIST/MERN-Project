import OpenAI from "openai";
import ErrorHandler from "../../utils/error.handler";
import ConversationRepository from "../repositories/conversation.repository";
import { Types } from "mongoose";
export default class ConversationService {
  private openai: OpenAI;
  private conversationRepository: ConversationRepository;
  constructor(conversationRepository: ConversationRepository, openai: OpenAI) {
    this.openai = openai;
    this.conversationRepository = conversationRepository;
  }
  // 새로운 대화를 생성
  public async createNewConversation(
    email: string,
    initialMessage: string
  ): Promise<{ conversationId: Types.ObjectId; aiResponse: string }> {
    try {
      const aiResponse = await this.getAiResponse(initialMessage);
      // 새로운 대화 도큐먼트를 생성하고 초기 메시지를 추가
      const newConversation = await this.conversationRepository.create({
        email,
        messages: [{ question: initialMessage, response: aiResponse, date: new Date() }]
      });

      return { conversationId: newConversation._id, aiResponse };
    } catch (error) {
      console.log(error);
      throw new ErrorHandler(500, "새로운 대화를 생성하는 중 오류가 발생했습니다.");
    }
  }

  //기존대화방에 추가해야함
  public async addMessageToConversation(conversationId: string, email: string, message: string): Promise<string> {
    // 1. 해당 대화방이 있는지 확인
    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new ErrorHandler(404, "해당 대화방을 찾을 수 없습니다.");
    }

    // 2. AI 응답 생성 (OpenAI API 호출)
    const aiResponse = await this.getAiResponse(message);

    // 3. 메시지 추가 (유저 질문 및 AI 응답)
    conversation.messages.push({
      question: message,
      response: aiResponse,
      date: new Date()
    });

    // 4. 대화 저장
    await conversation.save();

    return aiResponse; // 추가된 AI 응답 반환
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

  public async getConversationByEmail(email: string) {
    if (!email) {
      throw new ErrorHandler(400, "유효하지 않은 이메일입니다.");
    }

    // 유저의 이메일로 대화 기록을 조회
    const conversation = await this.conversationRepository.findByEmail(email);

    if (!conversation) {
      throw new ErrorHandler(404, "대화 기록을 찾을 수 없습니다.");
    }

    return conversation.messages;
  }
}
