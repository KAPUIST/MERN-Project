import express from "express";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";
import UsersRepository from "../repositories/users.repository";
import User from "../schemas/user.schema";
import { isAuthenticated } from "../../middlewares/authenticated.middleware";

const usersRepository = new UsersRepository(User);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);
const router = express.Router();

router.post("/signup", authController.createUser);
router.post("/signin", authController.login);
router.delete("/signout", isAuthenticated, authController.logout);

export default router;
