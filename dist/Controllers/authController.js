var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ErrorMessage, SuccessMessage, } from "../Middlewares/MessageMiddleware.js";
import { PrismaClient } from "@prisma/client";
import PiceComponent from "../Lib/ControllerHelper.js";
import { validationResult } from "express-validator";
const prisma = new PrismaClient();
class AuthController extends PiceComponent {
    constructor() {
        super();
    }
    //LOGIN LOGIC START HERE
    login(req, res, next) {
        const _super = Object.create(null, {
            checkUser: { get: () => super.checkUser },
            dcryptPassword: { get: () => super.dcryptPassword },
            setAccessToken: { get: () => super.setAccessToken },
            setRefreshToken: { get: () => super.setRefreshToken }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method !== "POST")
                ErrorMessage({
                    res,
                    message: "POST method only  supported",
                    statusCode: 400,
                });
            const data = req.body;
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
            const checkUser = yield _super.checkUser.call(this, data === null || data === void 0 ? void 0 : data.email);
            if (!checkUser.email)
                return ErrorMessage({ res, message: "User Not Found!", statusCode: 400 });
            const ispasswordCorrect = yield _super.dcryptPassword.call(this, data === null || data === void 0 ? void 0 : data.password, checkUser.password);
            if (!ispasswordCorrect)
                return ErrorMessage({
                    res,
                    message: "Password incorrect",
                    statusCode: 404,
                });
            yield _super.setAccessToken.call(this, res, checkUser === null || checkUser === void 0 ? void 0 : checkUser.id);
            yield _super.setRefreshToken.call(this, res, checkUser === null || checkUser === void 0 ? void 0 : checkUser.name, checkUser === null || checkUser === void 0 ? void 0 : checkUser.id);
            console.log(req.headers);
            SuccessMessage(res, 200, "Successfully Logged In.");
        });
    }
    //SIGNUP LOGIC START HERE
    signup(req, res, next) {
        const _super = Object.create(null, {
            checkUser: { get: () => super.checkUser },
            bcryptPassword: { get: () => super.bcryptPassword }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method !== "POST")
                return ErrorMessage({
                    res,
                    message: "POST method only supported!",
                    statusCode: 400,
                });
            const data = req.body;
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return ErrorMessage({
                    res,
                    message: result.array()[0].msg,
                    statusCode: 400,
                });
            }
            const checkUser = yield _super.checkUser.call(this, data === null || data === void 0 ? void 0 : data.email);
            if (checkUser === null || checkUser === void 0 ? void 0 : checkUser.email)
                return ErrorMessage({
                    res,
                    message: "User already exists",
                    statusCode: 400,
                });
            const password = yield _super.bcryptPassword.call(this, data === null || data === void 0 ? void 0 : data.password, 10);
            const setData = yield prisma.user.create({
                data: {
                    name: data === null || data === void 0 ? void 0 : data.name,
                    email: data === null || data === void 0 ? void 0 : data.email,
                    password: password,
                },
                select: {
                    name: true,
                    email: true,
                    password: false,
                },
            });
            SuccessMessage(res, 201, "Successfully Created User.", setData);
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
export default AuthController;
//# sourceMappingURL=authController.js.map