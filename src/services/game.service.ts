import prisma from "../prisma/client";

export const saveMove = async (roomId: string, move: any) => {
  const game = await prisma.game.findUnique({ where: { roomId } });
  if (!game) return null;

  const updatedMoves = Array.isArray(game.moves) ? [...game.moves, move] : [move];

  const updatedGame = await prisma.game.update({
    where: { roomId },
    data: {
      moves: updatedMoves,
    },
  });

  return updatedGame;
};