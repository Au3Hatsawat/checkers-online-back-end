import { PrismaClient } from "../../generated/prisma/index";

const prisma = new PrismaClient({
    log: [
        { level: "query", emit: "event" },  // ฟัง event query
        { level: "info", emit: "stdout" },  // แสดง info ปกติ
        { level: "warn", emit: "stdout" },  // แสดง warning
        { level: "error", emit: "stdout" }, // แสดง error
    ],
});

export default prisma;
