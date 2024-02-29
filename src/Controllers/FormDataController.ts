import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "../Middlewares/MessageMiddleware.js";
import { validationResult } from "express-validator";

class FormDataController {
  constructor() {}

  HomeData = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "POST")
      return ErrorMessage({
        res,
        message: "POST method only supported!",
        statusCode: 400,
      });

    const homeData = req.body;

    const result = validationResult(req);
    if (!result.isEmpty())
      return ErrorMessage({
        statusCode: 400,
        message: result.array()[0].msg,
        res,
      });

      

    console.log(homeData);
  };
}

export default FormDataController;
