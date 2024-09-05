import { Response } from "express";
export const successResponse = (res: Response, message: string, data: any = null, statusCode: number = 200) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data
  });
};
export const failedResponse = (res: Response, message: string, statusCode: number = 400) => {
  res.status(statusCode).json({
    statusCode,
    message
  });
};
