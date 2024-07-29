import { User } from "../models/user.js";
import { Router } from "express";

export const leaderboardRouter = Router();

leaderboardRouter.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["BP", "DESC"]],
      limit: 10,
      attributes: ["nickname", "BP", "picture"],
    });
    return res.json(users);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
