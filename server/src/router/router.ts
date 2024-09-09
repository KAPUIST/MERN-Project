import express from "express";
import AuthRouter from "../user/router/auth.router";
import UserRouter from "../user/router/user.router";
import ConversationRouter from "../conversation/router/conversation.router";
const router = express.Router();
router.use("/conversation", ConversationRouter);
router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

export default router;
