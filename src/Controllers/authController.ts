import { NextFunction, Request, Response } from "express";
import {
  ErrorMessage,
  SuccessMessage,
} from "../Middlewares/MessageMiddleware.js";
import { PrismaClient } from "@prisma/client";
import { loginDataTypes, singupDataTypes } from "../Data/Types.js";
import { validationResult } from "express-validator";
import { accessToken, refreshToken } from "../Lib/Variables.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class AuthController {
  constructor() {}

  //SIGNUP LOGIC START HERE
  signup = async (req: Request, res: Response, next: NextFunction) => {
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

    const checkUser = await this.checkUser(data?.email);

    if (checkUser?.email)
      return ErrorMessage({
        res,
        message: "User already exists",
        statusCode: 400,
      });

    const password = await this.bcryptPassword(data?.password, 10);

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
  };

  //LOGIN LOGIC START HERE
  login = async (req: Request, res: Response, next: NextFunction) => {
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

    const checkUser = await this.checkUser(data?.email);
    if (checkUser) {
      const ispasswordCorrect = await this.dcryptPassword(
        data?.password,
        checkUser.password
      );

      if (!ispasswordCorrect)
        return ErrorMessage({
          res,
          message: "Password incorrect",
          statusCode: 404,
        });

      const refresh_token = await this.getRefreshToken(
        res,
        checkUser?.name,
        checkUser?.id
      );
      const access_token = await this.getAccessToken(res, checkUser?.id);
      this.setCookies(res, refresh_token, true, refreshToken);
      this.setCookies(res, access_token, true, accessToken);
      SuccessMessage(res, 200, "Successfully Logged In.");
    } else {
      ErrorMessage({ res, message: "User Not Found!", statusCode: 400 });
    }
  };

  //GET USER DATA LOGIC START
  me = async (req: Request, res: Response) => {
    if (req.method !== "GET")
      return ErrorMessage({ res, message: "GET method only supported" });
    const userData = req?.body?.user;
    console.log(userData);
    if (!userData)
      return ErrorMessage({ res, statusCode: 401, message: "User not found" });
    const getUser = await prisma.user.findFirst({
      where: {
        id: userData?.id,
        name: userData?.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        created_at: true,
        updated_at: true,
        image: true,
        About: true,
        Home: true,
        languages: true,
        More: true,
        whyMe: true,
        work: true,
      },
    });

    SuccessMessage(res, 200, "Success", getUser);
  };

  //LOGOUT USER LOGIC START
  logout = async (req: Request, res: Response) => {
    if (req.method !== "GET")
      return ErrorMessage({ res, message: "GET method only supported" });

    this.setCookies(res, null, false, refreshToken);
    this.setCookies(res, null, false, accessToken);

    SuccessMessage(res, 200, "Successfully logged out");
  };

  //BCRYPT PASSWORD
  bcryptPassword = async (password: string, salt: number) => {
    return await bcrypt.hash(password, salt);
  };

  //DCRYPT PASSWORD
  dcryptPassword = async (password: string, encryptPassword: string) => {
    return await bcrypt.compare(password, encryptPassword);
  };

  //CHECK USER PRESENT IN THE DATABASE
  checkUser = async (email: string) => {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  };

  //SET TOKEN INTHE COOKIES
  setCookies = async (
    res: Response,
    token: string | null,
    isSetCookie: boolean,
    tokenType: string
  ) => {
    try {
      res.cookie(tokenType, isSetCookie ? token : "", {
        path: "/",
        httpOnly: true,
        maxAge: isSetCookie ? 60 * 60 * 1000 : 0,
      });
    } catch (err: any) {
      console.log(err);
      ErrorMessage({ res, message: err.message });
    }
  };

  //GETTING THE ACCESS TOKEN
  async getAccessToken(res: Response, id: number) {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) throw new Error("secret key is required");
    const accessToken = jwt.sign({ _id: id }, secretKey, {
      expiresIn: "8m",
    });
    return accessToken;
  }

  //GETTTING THE ACCESS TOKEN
  getRefreshToken = async (res: Response, userName: string, id: number) => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    if (!secretKey) throw new Error("secret key is required");
    const refreshToken = jwt.sign({ userName, id }, secretKey, {
      expiresIn: "5m",
    });
    return refreshToken;
  };

  refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const tokens = req?.cookies;

    if (!tokens?.refreshToken) {
      return ErrorMessage({
        statusCode: 403,
        message: "Access denied!",
        res,
      });
    }

    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    if (!secretKey)
      return ErrorMessage({
        statusCode: 404,
        message: "Secret key not Found",
        res,
      });

    this.verifyTokens({
      res,
      secretKey,
      getToken: tokens?.refreshToken,
      req,
      next,
    });

    const userData = req?.body?.user;
    const access_token = await this.getAccessToken(res, userData?.id);
    this.setCookies(res, access_token, true, accessToken);
    SuccessMessage(res, 200, "Access token is created successfully");
  };

  //CHEKCING THE ACCESS TOKEN MIDDLEWARE
  setCheckAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const getToken = req?.cookies?.accessToken;
    if (!getToken) {
      const newError = new Error("Access token not found");
      next(newError);
    }
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessSecret) {
      return ErrorMessage({
        res,
        message: "Secret Key Not Found!",
        statusCode: 401,
      });
    }
    this.verifyTokens({
      res,
      secretKey: accessSecret,
      getToken,
      req,
      next,
    });

    next();
  };

  verifyTokens = ({
    res,
    secretKey,
    getToken,
    req,
    next,
  }: {
    res: Response;
    secretKey: string;
    getToken: string;
    req: Request;
    next: NextFunction;
  }) => {
    try {
      const verify = jwt.verify(getToken, secretKey);
      req.body.user = verify;
    } catch (err: any) {
      console.log(err.message, "jwt verify error");
      res.status(403);
      next(err);
    }
  };
}

export default AuthController;
