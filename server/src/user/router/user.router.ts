import express from "express";

import { isAuthenticated } from "../../middlewares/authenticated.middleware";
import UserController from "../controllers/user.controller";
import AuthService from "../services/auth.service";
import UsersRepository from "../repositories/users.repository";
import User from "../schemas/user.schema";
const usersRepository = new UsersRepository(User);
const authService = new AuthService(usersRepository);
const userController = new UserController(authService);
const router = express.Router();

router.get("/me", isAuthenticated, userController.findMe);

export default router;
