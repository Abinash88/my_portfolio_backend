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
    console.log(data?.email);
    const checkUser = await this.checkUser(data?.email);
    if (!checkUser.email)
      return ErrorMessage({ res, message: "User Not Found!", statusCode: 400 });

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
  };

  //GET USER DATA LOGIC START
  me = async (req: Request, res: Response) => {
    if (req.method !== "GET")
      return ErrorMessage({ res, message: "GET method only supported" });
    const userData = req?.body?.user;
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
    token: string,
    isSetCookie: boolean,
    tokenType: string
  ) => {
    try {
      res.cookie(tokenType, isSetCookie ? token : "", {
        path: "/",
        httpOnly: true,
        maxAge: isSetCookie ? 60 * 60 * 1000 : 0,
      });
    } catch (err) {
      console.log(err);
      ErrorMessage({ res, message: err?.message });
    }
  };

  //GETTING THE ACCESS TOKEN
  async getAccessToken(res: Response, id: number) {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) throw new Error("secret key is required");
    const accessToken = jwt.sign({ _id: id }, secretKey, {
      expiresIn: 100 * 150,
    });
    return accessToken;
  }

  //GETTTING THE ACCESS TOKEN
  getRefreshToken = async (res: Response, userName: string, id: number) => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    if (!secretKey) throw new Error("secret key is required");
    const refreshToken = jwt.sign({ userName, id }, secretKey, {
      expiresIn: 100 * 150,
    });
    return refreshToken;
  };

  refreshAccessToken = async (res: Response, req: Request) => {
    const data = req.body;
    const tokens = req?.cookies;
    if (!tokens?.accessToken && !tokens?.refreshToken) {
      const checkUser = await this.checkUser(data?.email);

      //CHECK USER
      if (!checkUser?.id)
        return ErrorMessage({
          statusCode: 400,
          message: "User not found!",
          res,
        });

      const refresh_token = await this.getRefreshToken(
        res,
        checkUser?.name,
        checkUser?.id
      );
      this.setCookies(res, refresh_token, true, refreshToken);
      const access_token = await this.getAccessToken(res, checkUser?.id);
      this.setCookies(res, access_token, true, accessToken);
    } else if (!tokens?.accessToken && tokens?.refreshToken) {
      const secretKey = process.env.REFRESH_TOKEN_SECRET;
      if (!secretKey)
        ErrorMessage({ statusCode: 404, message: "Secret key not Found", res });
      this.verifyTokens({
        res,
        secretKey,
        getToken: tokens?.refreshToken,
        req,
      });
    }
  };

  //CHEKCING THE ACCESS TOKEN MIDDLEWARE
  setCheckAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const getToken = req?.cookies?.accessToken;

    if (!getToken) {
      const checkRefreshToken = req?.cookies?.refreshToken;
      if (!checkRefreshToken) {
        return ErrorMessage({
          res,
          message: "Token Expired!",
          statusCode: 404,
        });
      } else {
        await this.refreshAccessToken(res, req);
      }
    }

    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey)
      return ErrorMessage({
        res,
        message: "Secret key not Found!",
        statusCode: 404,
      });

    this.verifyTokens({ res, secretKey, getToken, req });
    next();
  };

  verifyTokens = ({
    res,
    secretKey,
    getToken,
    req,
  }: {
    res: Response;
    secretKey: string;
    getToken: string;
    req: Request;
  }) => {
    jwt.verify(getToken, secretKey, (err: Error, user: any) => {
      if (err) {
        console.log(err);
        return ErrorMessage({
          res,
          message: err.message,
          statusCode: 402,
        });
      } else {
        req.body.user = user;
      }
    });
  };
}

export default AuthController;
