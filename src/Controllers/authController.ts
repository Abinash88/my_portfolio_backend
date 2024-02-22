import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ErrorMessage } from "../Middlewares/ErrorMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AuthController {
  constructor() {}

  //LOGIN LOGIC START HERE
  async login(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "GET") console.log("error occured");
    const data = req.body;
    console.log(data);
  }

  //SIGNUP LOGIC START HERE
  async signup(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "POST")
      return ErrorMessage({
        res,
        message: "POST method only supported!",
        statusCode: 400,
      });
    const data = req.body;

    const result = validationResult(req);
    if (!result.isEmpty())
      return ErrorMessage({
        res,
        message: result.array()[0].msg,
        statusCode: 400,
      });

    const checkEmail = await prisma.user.findUnique({
      where: {
        email: data?.email,
      },
    });
  }
}

export default AuthController;
