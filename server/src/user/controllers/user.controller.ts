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
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. 세션에서 이메일을 가져오기
      const email = req.session.email;

      if (!email) {
        return failedResponse(res, "유효하지 않은 세션입니다.", 400);
      }

      // 2. 서비스 계층에서 유저 삭제 처리
      const isDeleted = await this.authService.deleteUser(email);

      if (!isDeleted) {
        return failedResponse(res, "유저가 존재하지 않습니다.", 404);
      }

      // 3. 유저가 삭제되면 세션을 파기하고 쿠키를 삭제
      req.session.destroy((err) => {
        if (err) {
          return next(err); // 세션 삭제 중 에러 발생 시
        }

        // 세션 쿠키 삭제
        res.clearCookie("connect.sid");

        // 성공 응답 반환
        return successResponse(res, "유저 회원탈퇴 성공.", true, 200);
      });
    } catch (error) {
      next(error); // 에러가 발생하면 에러 미들웨어로 전달
    }
  };
}
