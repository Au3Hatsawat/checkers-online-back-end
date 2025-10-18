import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async (username: string, email: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, email, password: passwordHash } });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    rating: user.rating,
    socketId: user.socketId,
    createdAt: user.createdAt,
  };

  return { user: safeUser, token };
};

