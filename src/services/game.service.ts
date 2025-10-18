import prisma from "../prisma/client.js";

export const saveMove = async (roomId: string, move: any) => {
  const game = await prisma.game.findUnique({ where: { roomId } });
  if (!game) return null;

  // เก็บ move ลง DB
  const updatedMoves = Array.isArray(game.moves) ? [...game.moves, move] : [move];

  // สลับฝั่ง
  const nextPlayer = game.currentPlayer === "red" ? "black" : "red";

  const updatedGame = await prisma.game.update({
    where: { roomId },
    data: {
      moves: updatedMoves,
      currentPlayer: nextPlayer, // 👈 อัปเดตตาเดิน
    },
  });

  return updatedGame;
};
