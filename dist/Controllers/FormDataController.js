import { ErrorMessage } from "../Middlewares/MessageMiddleware.js";
import { validationResult } from "express-validator";
class FormDataController {
    constructor() {
        this.HomeData = async (req, res, next) => {
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
}
export default FormDataController;
//# sourceMappingURL=FormDataController.js.map