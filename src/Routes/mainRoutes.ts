import express from "express";
const router = express.Router();
import AuthController from "../Controllers/authController.js";
import {
  LoginAuthValidatior,
  SignUpAuthValidator,
} from "../Middlewares/AuthValidation.js";
import { ErrorMiddleWareGenerator } from "../Middlewares/MessageMiddleware.js";

const authController = new AuthController();

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

router.get("/me", authController.me, ErrorMiddleWareGenerator);
router.get("/logout", authController.logout, ErrorMiddleWareGenerator);

router.get("/me", (req, res) => {
  res.send("hello world");
});

export default router;
