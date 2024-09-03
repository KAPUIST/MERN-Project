import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/error.handler";

interface CustomError extends Error {
  statusCode?: number;
}

export function CustomErrorHandler(error: CustomError, req: Request, res: Response, next: NextFunction): void {
  console.error(error);
  error = handleCommonErrors(error);
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.";

  res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message
  });
}
function handleCommonErrors(error: CustomError): CustomError {
  let newError = error;

  if (error.name === "ValidationError") {
    newError = new ErrorHandler(404, error.message);
  }

  return newError;
}
