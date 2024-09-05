import { NextFunction, Response, Request } from "express";
import AuthService from "../services/auth.service";
import { failedResponse, successResponse } from "../../utils/response.util";

export default class UserController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  findMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.session.email;

      if (!email) {
        return failedResponse(res, "로그인이 필요합니다.", 401);
      }

      const user = await this.authService.findMe(email);

      successResponse(res, "사용자 정보", user);
    } catch (error) {
      next(error);
    }
  };
}
