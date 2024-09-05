import AuthService from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { CreateUserDto, createUserSchema } from "../dtos/signup.dto";
import { successResponse } from "../../utils/response.util";
import { LoginUserDto, loginUserSchema } from "../dtos/login.dto";
//유저 생성 컨트롤러
export default class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await createUserSchema.validateAsync(req.body);

      const userInputData: CreateUserDto = value;

      const createUser = await this.authService.signUpUser(userInputData);
      successResponse(res, "회원가입 성공", createUser, 201);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await loginUserSchema.validateAsync(req.body);
      const userInputData: LoginUserDto = value;

      const user = await this.authService.loginUser(userInputData);

      req.session.email = user.email;
      successResponse(res, "로그인 성공", user, 200);
    } catch (error) {
      next(error);
    }
  };
  logout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err); // 세션 삭제 중 에러 발생 시
      }
      res.clearCookie("connect.sid"); // 세션 쿠키도 삭제
      return successResponse(res, "로그아웃 성공");
    });
  };
}
