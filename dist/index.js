import express, { urlencoded } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/mainRoutes.js";
const app = express();
const PORT = process.env.PORT || 8000;
import dotenv from "dotenv";
import { ErrorMessage } from "./Middlewares/MessageMiddleware.js";
dotenv.config();
app.use(helmet());
app.use(express.json());
app.use(urlencoded());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));
app.use("/api/v1/", router);
app.get("/", (_, res) => {
    res.json({ message: "hello world" });
});
app.use((err, req, res, next) => {
    const statusCode = req.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";
    return ErrorMessage({ statusCode, message: errorMessage, res });
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map