import { NextFunction, Request, Response } from "express";
import { failedResponse } from "../utils/response.util";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.email) {
    return next();
  } else {
    return failedResponse(res, "로그인이 필요합니다.", 401);
  }
};
