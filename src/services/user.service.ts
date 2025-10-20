import prisma from "../prisma/client";

export const findUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
}

export const findUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      rating: true,
      socketId: true,
      createdAt: true,
      gamesAsBlack: true,
      gamesAsRed: true,
    },
  });
  return user;
};
