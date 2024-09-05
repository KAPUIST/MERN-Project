import express from "express";
import AuthRouter from "../user/router/auth.router";
import UserRouter from "../user/router/user.router";
const router = express.Router();
router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
export default router;
