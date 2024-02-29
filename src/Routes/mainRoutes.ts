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

const authController = new AuthController();
const formController = new FormDataController();

router.post(
  "/login",
  LoginAuthValidatior,
  authController.login,
  ErrorMiddleWareGenerator
);

router.post(
  "/signup",
  SignUpAuthValidator,
  authController.signup,
  ErrorMiddleWareGenerator
);

router.get(
  "/me",
  authController.setCheckAccessToken,
  authController.me,
  ErrorMiddleWareGenerator
);
router.get("/logout", authController.logout, ErrorMiddleWareGenerator);

router.post(
  "/home",
  HomeDataValidator,
  authController.setCheckAccessToken,
  formController?.HomeData,
  ErrorMiddleWareGenerator
);

export default router;
