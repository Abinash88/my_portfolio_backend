import { ErrorMessage } from "../Middlewares/MessageMiddleware.js";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import { SuccessMessage } from "../Middlewares/MessageMiddleware.js";
import AuthController from "./authController.js";
const prisma = new PrismaClient();
class FormDataController {
    constructor() {
        this.auth = new AuthController();
        this.HomeData = async (req, res, next) => {
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
                    copy_email: homeData === null || homeData === void 0 ? void 0 : homeData.copy_email,
                    description: homeData === null || homeData === void 0 ? void 0 : homeData.description,
                    image: "",
                    logo_name: homeData === null || homeData === void 0 ? void 0 : homeData.logo_name,
                    title: homeData === null || homeData === void 0 ? void 0 : homeData.title,
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
}
export default FormDataController;
//# sourceMappingURL=FormDataController.js.map