import express from "express";

import ConversationService from "../services/conversation.service";
import ConversationController from "../controllers/conversation.controller";
import { isAuthenticated } from "../../middlewares/authenticated.middleware";
import { Conversation } from "../schemas/conversation.shchema";
import ConversationRepository from "../repositories/conversation.repository";
import { openai } from "../../config/openai";
const router = express.Router();
const conversationRepository = new ConversationRepository(Conversation);
const conversationService = new ConversationService(conversationRepository, openai);
const conversationController = new ConversationController(conversationService);

router.post("/", isAuthenticated, conversationController.askQuestion);
router.get("/", isAuthenticated, conversationController.getConversation);

export default router;
