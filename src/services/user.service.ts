import prisma from "../prisma/client.js";

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      rating: true,
      socketId: true,
      createdAt: true,
    },
  });
  return user;
};
