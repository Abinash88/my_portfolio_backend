import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "../Middlewares/MessageMiddleware.js";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { SuccessMessage } from "../Middlewares/MessageMiddleware.js";
import AuthController from "./authController.js";
import { HomeData } from "../Data/Types.js";

const prisma = new PrismaClient();

class FormDataController {
  constructor() {}

  auth = new AuthController();
  HomeData = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "POST")
      return ErrorMessage({
        res,
        message: "POST method only supported!",
        statusCode: 400,
      });

    const image = req.file;
    const homeData = req.body;

    if (!homeData)
      return ErrorMessage({ statusCode: 404, message: "No home data", res });
    console.log(homeData, image);

    const result = validationResult(req);
    if (!result.isEmpty())
      return ErrorMessage({
        statusCode: 400,
        message: result.array()[0].msg,
        res,
      });

    const token = req.cookies.accessToken;
    if (!token)
      return ErrorMessage({
        statusCode: 403,
        res,
        message: "Unautherized User",
      });
    const userId = req.body.user._id;
    const checkUser = await prisma.home.create({
      data: {
        copy_email: homeData?.copy_email,
        description: homeData?.description,
        image: "",
        logo_name: homeData?.logo_name,
        title: homeData?.title,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return SuccessMessage(res, 200, "Home data is created Successfully!");
  };
}

export default FormDataController;
