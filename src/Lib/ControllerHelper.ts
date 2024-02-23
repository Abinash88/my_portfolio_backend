import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { ErrorMessage } from "../Middlewares/MessageMiddleware.js";
const prisma = new PrismaClient();

class PiceComponent {
  constructor() {}

  async bcryptPassword(password: string, salt: number) {
    return await bcrypt.hash(password, salt);
  }

  async dcryptPassword(password: string, encryptPassword: string) {
    return await bcrypt.compare(password, encryptPassword);
  }

  async checkUser(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async setCookies(
    res: Response,
    token: string,
    isSetCookie: boolean,
    tokenType: string
  ) {
    try {
      res.setHeader(
        "set-Cookie",
        serialize(tokenType, isSetCookie ? token : "", {
          path: "/",
          httpOnly: true,
          maxAge: isSetCookie ? 100 * 150 : 0,
        })
      );
    } catch (err) {
      console.log(err);
      ErrorMessage({ res, message: err?.message });
    }
  }

  async setAccessToken(res: Response, id: number) {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) throw new Error("secret key is required");
    const accessToken = jwt.sign({ _id: id }, secretKey, {
      expiresIn: 100 * 150,
    });
    PiceComponent.setCookies(res, accessToken, true, "accessToken");
  }

  async setRefreshToken(res: Response, userName: string, id: number) {
    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    if (!secretKey) throw new Error("secret key is required");
    const refreshToken = jwt.sign({ userName, id }, secretKey, {
      expiresIn: 100 * 150,
    });

    PiceComponent.setCookies(res, refreshToken, true, "refreshToken");
  }
}

export default PiceComponent;

const picecomponents = new PiceComponent();
