import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { CustomErrorHandler } from "./middlewares/error.middleware";
import { connectDB } from "./config/database";
dotenv.config();

const app = express();

const PORT = process.env.SERVER_PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", (req, res, next) => {
  res.status(200).send("OK");
});

app.use((req, res, next) => {
  res.status(404).send("해당페이지를 찾을 수 없습니다.");
});
//에러처리 미들웨어 등록
app.use(CustomErrorHandler);
app.listen(PORT, async () => {
  //DB커넥션
  await connectDB();
  console.log("Listening on Port" + PORT);
});
