import express from "express";
import AuthRouter from "../user/router/auth.router";
import UserRouter from "../user/router/user.router";
import ChatRouter from "../chat/router/chat.router";
const router = express.Router();
router.use("/chat", ChatRouter);
router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

export default router;
