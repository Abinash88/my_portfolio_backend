var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { ErrorMessage } from "../Middlewares/MessageMiddleware.js";
const prisma = new PrismaClient();
class PiceComponent {
    constructor() { }
    bcryptPassword(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.hash(password, salt);
        });
    }
    dcryptPassword(password, encryptPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.compare(password, encryptPassword);
        });
    }
    checkUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findUnique({
                where: {
                    email,
                },
            });
        });
    }
    static setCookies(res, token, isSetCookie, tokenType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.setHeader("set-Cookie", serialize(tokenType, isSetCookie ? token : "", {
                    path: "/",
                    httpOnly: true,
                    maxAge: isSetCookie ? 100 * 150 : 0,
                }));
            }
            catch (err) {
                console.log(err);
                ErrorMessage({ res, message: err === null || err === void 0 ? void 0 : err.message });
            }
        });
    }
    setAccessToken(res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKey = process.env.ACCESS_TOKEN_SECRET;
            if (!secretKey)
                throw new Error("secret key is required");
            const accessToken = jwt.sign({ _id: id }, secretKey, {
                expiresIn: 100 * 150,
            });
            PiceComponent.setCookies(res, accessToken, true, "accessToken");
        });
    }
    setRefreshToken(res, userName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            if (!secretKey)
                throw new Error("secret key is required");
            const refreshToken = jwt.sign({ userName, id }, secretKey, {
                expiresIn: 100 * 200,
            });
            PiceComponent.setCookies(res, refreshToken, true, "refreshToken");
        });
    }
}
export default PiceComponent;
const picecomponents = new PiceComponent();
//# sourceMappingURL=ControllerHelper.js.map