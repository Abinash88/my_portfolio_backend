import { NextFunction, Request, Response } from "express";
import {
  ErrorMessage,
  SuccessMessage,
} from "../Middlewares/MessageMiddleware.js";
import { PrismaClient } from "@prisma/client";
import { loginDataTypes, singupDataTypes } from "../Data/Types.js";
import PiceComponent from "../Lib/ControllerHelper.js";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

class AuthController extends PiceComponent {
  constructor() {
    super();
  }

  //LOGIN LOGIC START HERE
  async login(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "POST")
      ErrorMessage({
        res,
        message: "POST method only  supported",
        statusCode: 400,
      });

    const data: loginDataTypes = req.body;

    //CHECK VALIDATION
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return ErrorMessage({
        res,
        message: result.array()[0].msg,
        statusCode: 400,
      });
    }
    //CHECK USER
    const checkUser = await super.checkUser(data?.email);
    if (!checkUser.email)
      return ErrorMessage({ res, message: "User Not Found!", statusCode: 400 });

    const ispasswordCorrect = await super.dcryptPassword(
      data?.password,
      checkUser.password
    );

    if (!ispasswordCorrect)
      return ErrorMessage({
        res,
        message: "Password incorrect",
        statusCode: 404,
      });

    await super.setAccessToken(res, checkUser?.id);
    await super.setRefreshToken(res, checkUser?.name, checkUser?.id);
    console.log(req.headers);
    SuccessMessage(res, 200, "Successfully Logged In.");
  }

  //SIGNUP LOGIC START HERE
  async signup(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "POST")
      return ErrorMessage({
        res,
        message: "POST method only supported!",
        statusCode: 400,
      });

    const data: singupDataTypes = req.body;

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return ErrorMessage({
        res,
        message: result.array()[0].msg,
        statusCode: 400,
      });
    }
    const checkUser = await super.checkUser(data?.email);

    if (checkUser?.email)
      return ErrorMessage({
        res,
        message: "User already exists",
        statusCode: 400,
      });

    const password = await super.bcryptPassword(data?.password, 10);

    const setData = await prisma.user.create({
      data: {
        name: data?.name,
        email: data?.email,
        password: password,
      },
      select: {
        name: true,
        email: true,
        password: false,
      },
    });

    SuccessMessage(res, 201, "Successfully Created User.", setData);
  }

  async me(req: Request, res: Response) {
    if (req.method !== "GET")
      return ErrorMessage({ res, message: "GET method only supported" });
    const getData = req.headers;
    let accesToken = "";
    // for (let i = 0; i <= getData?.length; i++) {
    //   if (getData?.includes("accessToken")) {
    //     accesToken += getData[i].split("=")[1];
    //   }
    // }
    console.log(getData);
  }

  async logout(req: Request, res: Response) {
    if (req.method !== "GET")
      return ErrorMessage({ res, message: "GET method only supported" });
    super.setCookies();
  }
}

export default AuthController;
