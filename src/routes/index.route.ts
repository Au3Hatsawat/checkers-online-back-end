import { Router } from "express";
import authRouter from "./auth.route";

const router = Router();

// prefix route ถ้าต้องการ
router.use("/auth", authRouter);

export default router;
