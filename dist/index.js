import express, { urlencoded } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/mainRoutes.js";
const app = express();
const PORT = process.env.PORT || 8000;
app.use(helmet());
app.use(express.json());
app.use(urlencoded());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));
app.use("/api/v1/", router);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map