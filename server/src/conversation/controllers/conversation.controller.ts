import { NextFunction, Request, Response } from "express";
// AI 서비스 임포트
import ErrorHandler from "../../utils/error.handler"; // 커스텀 에러 핸들러
import ConversationService from "../services/conversation.service";
import { failedResponse, successResponse } from "../../utils/response.util";
import { conversationDtoSchema } from "../dtos/conversation.dto";

export default class ConversationController {
  private conversationService: ConversationService;

  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService; // AI 서비스 의존성 주입
  }

  // 새로운 질문을 처리하고 AI 응답 반환
  askQuestion = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.session.email;

    try {
      const { message, conversationId } = await conversationDtoSchema.validateAsync(req.body);
      if (!email || !message) {
        return failedResponse(res, "유저 이메일, 메시지가 필요합니다.", 400);
      }

      let aiResponse;
      if (conversationId) {
        // 1. 기존 대화에 메시지를 추가
        aiResponse = await this.conversationService.addMessageToConversation(conversationId, email, message);
        return successResponse(res, "대화 생성에 성공했습니다.", { conversationId, aiResponse }, 200);
      } else {
        // 2. 새로운 대화를 생성하고 메시지를 추가
        const { conversationId, aiResponse } = await this.conversationService.createNewConversation(email, message);
        return successResponse(res, "대화 생성에 성공했습니다.", { conversationId, aiResponse }, 200);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email = req.session.email;

    if (!email) {
      return failedResponse(res, "유저 이메일이 필요합니다.", 400);
    }

    try {
      // 유저의 대화 기록을 AI 서비스에서 가져옴
      const messages = await this.conversationService.getConversationByEmail(email);
      return successResponse(res, "메시지 조회에 성공했습니다.", messages, 200);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
