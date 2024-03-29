import { ErrorMessage, SuccessMessage, } from "../Middlewares/MessageMiddleware.js";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { accessToken, refreshToken } from "../Lib/Variables.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
class AuthController {
    constructor() {
        //SIGNUP LOGIC START HERE
        this.signup = async (req, res, next) => {
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
            const checkUser = await this.checkUser(data === null || data === void 0 ? void 0 : data.email);
            if (checkUser === null || checkUser === void 0 ? void 0 : checkUser.email)
                return ErrorMessage({
                    res,
                    message: "User already exists",
                    statusCode: 400,
                });
            const password = await this.bcryptPassword(data === null || data === void 0 ? void 0 : data.password, 10);
            const setData = await prisma.user.create({
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
        };
        //LOGIN LOGIC START HERE
        this.login = async (req, res, next) => {
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
            const checkUser = await this.checkUser(data === null || data === void 0 ? void 0 : data.email);
            if (checkUser) {
                const ispasswordCorrect = await this.dcryptPassword(data === null || data === void 0 ? void 0 : data.password, checkUser.password);
                if (!ispasswordCorrect)
                    return ErrorMessage({
                        res,
                        message: "Password incorrect",
                        statusCode: 404,
                    });
                const refresh_token = await this.getRefreshToken(res, checkUser === null || checkUser === void 0 ? void 0 : checkUser.name, checkUser === null || checkUser === void 0 ? void 0 : checkUser.id);
                const access_token = await this.getAccessToken(res, checkUser === null || checkUser === void 0 ? void 0 : checkUser.id);
                this.setCookies(res, refresh_token, true, refreshToken);
                this.setCookies(res, access_token, true, accessToken);
                SuccessMessage(res, 200, "Successfully Logged In.");
            }
            else {
                ErrorMessage({ res, message: "User Not Found!", statusCode: 400 });
            }
        };
        //GET USER DATA LOGIC START
        this.me = async (req, res) => {
            var _a;
            if (req.method !== "GET")
                return ErrorMessage({ res, message: "GET method only supported" });
            const userData = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.user;
            console.log(userData);
            if (!userData)
                return ErrorMessage({ res, statusCode: 401, message: "User not found" });
            const getUser = await prisma.user.findFirst({
                where: {
                    id: userData === null || userData === void 0 ? void 0 : userData.id,
                    name: userData === null || userData === void 0 ? void 0 : userData.name,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: false,
                    created_at: true,
                    updated_at: true,
                    image: true,
                    About: true,
                    Home: true,
                    languages: true,
                    More: true,
                    whyMe: true,
                    work: true,
                },
            });
            SuccessMessage(res, 200, "Success", getUser);
        };
        //LOGOUT USER LOGIC START
        this.logout = async (req, res) => {
            if (req.method !== "GET")
                return ErrorMessage({ res, message: "GET method only supported" });
            this.setCookies(res, null, false, refreshToken);
            this.setCookies(res, null, false, accessToken);
            SuccessMessage(res, 200, "Successfully logged out");
        };
        //BCRYPT PASSWORD
        this.bcryptPassword = async (password, salt) => {
            return await bcrypt.hash(password, salt);
        };
        //DCRYPT PASSWORD
        this.dcryptPassword = async (password, encryptPassword) => {
            return await bcrypt.compare(password, encryptPassword);
        };
        //CHECK USER PRESENT IN THE DATABASE
        this.checkUser = async (email) => {
            return await prisma.user.findUnique({
                where: {
                    email,
                },
            });
        };
        //SET TOKEN INTHE COOKIES
        this.setCookies = async (res, token, isSetCookie, tokenType) => {
            try {
                res.cookie(tokenType, isSetCookie ? token : "", {
                    path: "/",
                    httpOnly: true,
                    maxAge: isSetCookie ? 60 * 60 * 1000 : 0,
                });
            }
            catch (err) {
                console.log(err);
                ErrorMessage({ res, message: err.message });
            }
        };
        //GETTTING THE ACCESS TOKEN
        this.getRefreshToken = async (res, userName, id) => {
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            if (!secretKey)
                throw new Error("secret key is required");
            const refreshToken = jwt.sign({ userName, id }, secretKey, {
                expiresIn: "5m",
            });
            return refreshToken;
        };
        this.refreshAccessToken = async (req, res, next) => {
            var _a;
            const tokens = req === null || req === void 0 ? void 0 : req.cookies;
            if (!(tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken)) {
                return ErrorMessage({
                    statusCode: 403,
                    message: "Access denied!",
                    res,
                });
            }
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            if (!secretKey)
                return ErrorMessage({
                    statusCode: 404,
                    message: "Secret key not Found",
                    res,
                });
            this.verifyTokens({
                res,
                secretKey,
                getToken: tokens === null || tokens === void 0 ? void 0 : tokens.refreshToken,
                req,
                next,
            });
            const userData = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.user;
            const access_token = await this.getAccessToken(res, userData === null || userData === void 0 ? void 0 : userData.id);
            this.setCookies(res, access_token, true, accessToken);
            SuccessMessage(res, 200, "Access token is created successfully");
        };
        //CHEKCING THE ACCESS TOKEN MIDDLEWARE
        this.setCheckAccessToken = (req, res, next) => {
            var _a;
            const getToken = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
            if (!getToken) {
                const newError = new Error("Access token not found");
                next(newError);
            }
            const accessSecret = process.env.ACCESS_TOKEN_SECRET;
            if (!accessSecret) {
                return ErrorMessage({
                    res,
                    message: "Secret Key Not Found!",
                    statusCode: 401,
                });
            }
            this.verifyTokens({
                res,
                secretKey: accessSecret,
                getToken,
                req,
                next,
            });
            next();
        };
        this.verifyTokens = ({ res, secretKey, getToken, req, next, }) => {
            try {
                const verify = jwt.verify(getToken, secretKey);
                req.body.user = verify;
            }
            catch (err) {
                console.log(err.message, "jwt verify error");
                res.status(403);
                next(err);
            }
        };
    }
    //GETTING THE ACCESS TOKEN
    async getAccessToken(res, id) {
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        if (!secretKey)
            throw new Error("secret key is required");
        const accessToken = jwt.sign({ _id: id }, secretKey, {
            expiresIn: "8m",
        });
        return accessToken;
    }
}
export default AuthController;
//# sourceMappingURL=authController.js.map