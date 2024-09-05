import express from "express";
import AuthRouter from "../user/router/auth.router";
const router = express.Router();
router.use("/auth", AuthRouter);
export default router;
