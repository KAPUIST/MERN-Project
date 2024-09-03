import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGO_URI;
    if (!dbUri) {
      console.error("몽고디비 URI가 설정되지 않았습니다.");
      process.exit(1);
    }
    await mongoose.connect(dbUri);
    console.log("몽고디비에 성공적으로 연결되었습니다.");
  } catch (error) {
    console.error("몽고디비 연결 에러 :", error);
    process.exit(1);
  }
};
