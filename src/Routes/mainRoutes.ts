import express from "express";
const router = express.Router();
import AuthController from "../Controllers/authController.js";
import {
  HomeDataValidator,
  LoginAuthValidatior,
  SignUpAuthValidator,
} from "../Middlewares/AuthValidation.js";
import { ErrorMiddleWareGenerator } from "../Middlewares/MessageMiddleware.js";
import FormDataController from "../Controllers/FormDataController.js";
import { upload } from "../Middlewares/FormDataMiddleware.js";

const authController = new AuthController();
const formController = new FormDataController();

router.post(
  "/login",
  LoginAuthValidatior,
  ErrorMiddleWareGenerator(authController.login.bind(authController))
);

router.post(
  "/signup",
  SignUpAuthValidator,
  ErrorMiddleWareGenerator(authController.signup.bind(authController))
);

router.get(
  "/me",
  authController.setCheckAccessToken,
  ErrorMiddleWareGenerator(authController.me.bind(authController))
);

router.get(
  "/logout",
  ErrorMiddleWareGenerator(authController.logout.bind(authController))
);

router.post(
  "/refreshToken",
  ErrorMiddleWareGenerator(
    authController.refreshAccessToken.bind(authController)
  )
);

router.post(
  "/home",
  HomeDataValidator,
  authController.setCheckAccessToken,
  upload.single("image"),
  ErrorMiddleWareGenerator(formController?.HomeData.bind(formController))
);

export default router;
