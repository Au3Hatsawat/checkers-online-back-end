import { Server, Socket } from "socket.io";
import prisma from "../prisma/client.js";
import { v4 as uuid } from "uuid";
import { saveMove } from "../services/game.service.js";

let queue: { userId: number; socket: Socket }[] = [];

// สร้างห้องใหม่ถ้ามีคู่พร้อม
export const joinQueue = async (
  userId: number,
  socket: Socket,
  io: Server,
  queue: { userId: number; socket: Socket }[]
) => {
  if (queue.length > 0) {
    const opponent = queue.shift()!;
    const roomId = uuid();

    const red = await prisma.user.findUnique({ where: { id: Number(opponent.userId) } });
    const black = await prisma.user.findUnique({ where: { id: Number(userId) } });

    if (!red || !black) {
      console.warn(`❗ ไม่พบ user id ใน DB: Red=${opponent.userId}, Black=${userId}`);
      return null;
    }

    const game = await prisma.game.create({
      data: {
        roomId,
        playerRedId: red.id,
        playerBlackId: black.id,
        status: "playing",
        moves: [],
        currentPlayer: "red", 
      },
    });

    socket.join(roomId);
    opponent.socket.join(roomId);

    io.to(roomId).emit("matchFound", { roomId, redPlayer: opponent.userId, blackPlayer: userId });
    console.log(`🎮 Room ${roomId} created for players ${red.id} (red) vs ${black.id} (black)`);

    return game;
  } else {
    queue.push({ userId, socket });
    return null;
  }
};

export const registerSocketEvents = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Quick match
    socket.on("quickMatch", async (userId: number) => {
      socket.data.userId = userId;
      const game = await joinQueue(userId, socket, io, queue);
      if (!game) socket.emit("waitingForOpponent");
    });

    // Join room (กรณีเข้ามาทีหลัง)
    socket.on("joinRoom", async (roomId: string, userId: number) => {
      socket.data.userId = userId;
      socket.join(roomId);
      console.log(`🔗 ${socket.id} joined room ${roomId}`);

      const game = await prisma.game.findUnique({ where: { roomId } });
      if (!game) return;

      let side: "red" | "black" = "red";
      if (game.playerRedId === Number(userId)) side = "red";
      else if (game.playerBlackId === Number(userId)) side = "black";
      else {
        console.warn(`⚠️ user ${userId} tried to join room ${roomId} but not in game`);
        return;
      }

      socket.emit("setPlayerSide", side);
      socket.emit("setCurrentPlayer", game.currentPlayer);
    });

    // Make move
    socket.on("makeMove", async (roomId: string, move: any) => {
      const game = await prisma.game.findUnique({ where: { roomId } });
      if (!game) return;

      // ✅ ตรวจสอบว่าผู้เล่นนี้เป็นคนที่ถึงตาหรือเปล่า
      const userId = Number(socket.data.userId);
      const isRedTurn = game.currentPlayer === "red" && game.playerRedId === userId;
      const isBlackTurn = game.currentPlayer === "black" && game.playerBlackId === userId;

      if (!isRedTurn && !isBlackTurn) {
        console.log(`ไม่ใช่ตาของ user ${userId}`);
        return;
      }

      // บันทึก move
      const updatedGame = await saveMove(roomId, move);

      // ✅ สลับตา (red <-> black)
      const nextPlayer = game.currentPlayer === "red" ? "black" : "red";
      await prisma.game.update({
        where: { roomId },
        data: { currentPlayer: nextPlayer },
      });

      console.log(`🎯 Move received in room ${roomId}:`, move, "Next:", nextPlayer);

      // ✅ ส่งให้ทั้งห้อง (แต่ client จะ ignore ตัวเองอยู่แล้ว)
      io.to(roomId).emit("opponentMove", {
        move,
        senderId: socket.id,
        nextPlayer,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      queue = queue.filter((p) => p.socket.id !== socket.id);
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
