import { Router } from "express";
import { Room } from "../models/room.js";

export const roomRouter = Router();

roomRouter.post("/", async (req, res) => {
  try {
    const token1 = req.headers.authorization1.split(" ")[1];
    const token2 = req.headers.authorization2.split(" ")[1];
    const isPve = req.body.isPve;
    if (!isPve && !token1 && !token2) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    if (isPve && !token1) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    const user1 = await User.findOne({
      where: {
        accessToken: token1,
      },
    });
    const user2 = await User.findOne({
      where: {
        accessToken: token2,
      },
    });
    if (!isPve && (!user1 || !user2)) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    const room = await Room.create({
      status: req.body.status,
      token1: token1,
      token2: token2,
      socketId1: req.body.socketId1,
      socketId2: req.body.socketId2,
      isPve: isPve,
    });
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.get("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.token1 !== token && room.token2 !== token) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.delete("/:id", async (req, res) => {
  try {
    const room = await Room.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.get("/:id/sockets", async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    return res.json({ socketId1: room.socketId1, socketId2: room.socketId2 });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
