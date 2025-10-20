import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";

const router = Router();

// prefix route ถ้าต้องการ
router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
