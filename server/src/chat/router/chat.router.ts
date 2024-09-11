import express from "express";

import ChatService from "../services/chat.service";
import ChatController from "../controllers/chat.controller";
import { isAuthenticated } from "../../middlewares/authenticated.middleware";
import Message from "../schemas/message.schema";
import ChatRoom from "../schemas/chatRoom.schema";
import ChatRepository from "../repositories/chat.repository";
import { openai } from "../../config/openai";
const router = express.Router();
const chatRepository = new ChatRepository(ChatRoom, Message);
const chatService = new ChatService(chatRepository, openai);
const chatController = new ChatController(chatService);

//유저가 소유한 채팅방
router.get("/rooms", isAuthenticated, chatController.getUserChatRooms);
//새로운 채팅방 생성
router.post("/message", isAuthenticated, chatController.handleUserMessage);
//특정 채팅방의 메시지 리스트 조회스
router.get("/rooms/:chatRoomId/messages", isAuthenticated, chatController.getChatRoomMessages);

export default router;
