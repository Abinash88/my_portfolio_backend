import express, { urlencoded } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/mainRoutes.js";
const app = express();
const PORT = process.env.PORT || 8000;

import dotenv from "dotenv";

dotenv.config();
app.use(helmet());
app.use(express.json());
app.use(urlencoded());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/v1/", router);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
