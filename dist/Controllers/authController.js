var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validationResult } from "express-validator";
import { ErrorMessage } from "../Middlewares/ErrorMiddleware.js";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
class AuthController {
    constructor() { }
    //LOGIN LOGIC START HERE
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method !== "GET")
                console.log("error occured");
            const data = req.body;
            console.log(data);
        });
    }
    //SIGNUP LOGIC START HERE
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method !== "POST")
                return ErrorMessage({
                    res,
                    message: "POST method only supported!",
                    statusCode: 400,
                });
            const data = req.body;
            const result = validationResult(req);
            if (!result.isEmpty())
                return ErrorMessage({
                    res,
                    message: result.array()[0].msg,
                    statusCode: 400,
                });
            // const checkEmail = prisma;
        });
    }
}
export default AuthController;
//# sourceMappingURL=authController.js.map