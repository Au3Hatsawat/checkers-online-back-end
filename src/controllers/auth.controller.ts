import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import { findUserById } from "../services/user.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser(username, email, password);
    res.json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
