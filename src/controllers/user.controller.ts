import { Request, Response } from "express";
import { findUsers } from "../services/user.service";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await findUsers();
    res.json(users);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};