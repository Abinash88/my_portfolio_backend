import { NextFunction, Request, Response } from "express";

export const ErrorMiddleware = (err: Error, req: Request, res: Response) => {
  console.log(err, "middleware error");
};

export const ErrorMessage = ({
  statusCode = 500,
  message = "Internal Server Error!",
  res,
}: {
  statusCode?: number;
  message?: string;
  res: Response;
}) => {
  return res.status(statusCode).json({ success: false, message });
};

export const ErrorMiddleWareGenerator =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      ErrorMessage({ res, message: `${err.message}` });
    });
  };

export const SuccessMessage = <T>(
  res: Response,
  statusCode = 200,
  message: string,
  data?: T
) => {
  return res.status(statusCode).json({ status: true, message, data });
};
