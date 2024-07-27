import { Router } from "express";
import { Room } from "../models/room.js";
import { User } from "../models/user.js";

export const roomRouter = Router();

roomRouter.post("/", async (req, res) => {
  try {
    console.log("logging req.body", req.body);
    console.log("logging req.headers", req.headers);
    const token1 = req.headers.authorization1.split(" ")[1];
    const token2 = req.headers.authorization2.split(" ")[1];
    const isPve = req.body.isPve;
    console.log("logging token1", token1);
    console.log("logging token2", token2);
    console.log("logging isPve", isPve);
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
    if (isPve && !user1) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    const room = await Room.create({
      status: req.body.status,
      userId1: user1.id,
      userId2: isPve ? 'pveGame' : user2.id,
      isPve: isPve,
      user1Status: isPve ? "pve" : "pending",
      user2Status: isPve ? "pve" : "pending",
    });
    console.log("logging room", room);
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
    const user = await User.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.id !== room.userId1 && user.id !== room.userId2) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (user.id === room.userId1 ) {
        console.log("logging room", room);
        const user2 = await User.findOne({
          where: {
            id: room.userId2,
          },
        });
        return res.json({id: room.id, status: room.status, isPve: room.isPve, socketId1: user.socketId, socketId2: user2.socketId, playerTitle: "p1", user1Status: room.user1Status, user2Status: room.user2Status});
    }
    console.log("logging room", room);
    const user2 = await User.findOne({
      where: {
        id: room.userId1,
      },
    });
    return res.json({id: room.id, status: room.status, isPve: room.isPve, socketId1: user.socketId, socketId2: user2.socketId, playerTitle: "p2", user1Status: room.user1Status, user2Status: room.user2Status});
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
    if (!room) return res.status(404).json({ error: "Room not found" });
    const user1 = await User.findOne({
      where: {
        id: room.userId1,
      },
    });
    const user2 = await User.findOne({
      where: {
        id: room.userId2,
      },
    });
    return res.json({ socketId1: user1.socketId, socketId2: user2.socketId });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.put("/:id/playerStatus", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    const user = await User.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.id !== room.userId1 && user.id !== room.userId2) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (user.id === room.userId1) {
      console.log("setting user1 status", req.body.status);
      room.user1Status = req.body.status;
    } else {
      console.log("setting user2 status", req.body.status);
      room.user2Status = req.body.status;
    }
    await room.save();
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
