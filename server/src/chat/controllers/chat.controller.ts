import { NextFunction, Request, Response } from "express";
// AI 서비스 임포트
import ErrorHandler from "../../utils/error.handler"; // 커스텀 에러 핸들러
import ChatService from "../services/chat.service";
import { failedResponse, successResponse } from "../../utils/response.util";
import { chatDtoSchema } from "../dtos/chat.dto";

export default class ChatController {
  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService; // AI 서비스 의존성 주입
  }

  // 채팅방이 없다면 생성해야하고, 있으면 이어서 메시지를 작성해야합니당ㅇ
  handleUserMessage = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.session.email;
    if (!email) {
      return failedResponse(res, "세션이 만료되었거나 이메일 정보가 누락되었습니다.", 401);
    }

    try {
      const { message, chatId } = await chatDtoSchema.validateAsync(req.body);
      if (!message) {
        failedResponse(res, "메시지는 필수입니다.", 400);
      }
      let chatRoomId: string;
      if (!chatId) {
        chatRoomId = await this.chatService.createChatRoom(email);
      } else {
        const chatRoom = await this.chatService.findChatRoomById(chatId);
        if (!chatRoom) {
          return failedResponse(res, "해당 채팅방을 찾을 수 없습니다.");
        }
        chatRoomId = chatId;
      }
      const newMessage = await this.chatService.handleUserMessage({ chatRoomId, message });
      return successResponse(res, "메시지가 성공적으로 전송되었습니다.", newMessage, 201);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getUserChatRooms = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.session?.email;
    if (!email) {
      return failedResponse(res, "세션이 만료되었거나 이메일 정보가 누락되었습니다.", 401);
    }

    try {
      const chatRooms = await this.chatService.getUserChatRooms(email);
      return successResponse(res, "채팅방 리스트가 성공적으로 로드되었습니다.", chatRooms, 200);
    } catch (error) {
      next(error);
    }
  };
  // 특정 채팅방의 메시지 리스트 가져오기
  getChatRoomMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { chatRoomId } = req.params;

    if (!chatRoomId) {
      return failedResponse(res, "채팅방 ID가 필요합니다.", 400);
    }

    try {
      const messages = await this.chatService.getChatRoomMessages(chatRoomId);
      return successResponse(res, "메시지 리스트가 성공적으로 로드되었습니다.", messages, 200);
    } catch (error) {
      next(error);
    }
  };
}
