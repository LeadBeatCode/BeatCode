import { Router } from "express";
import { Room } from "../models/room.js";
import { User } from "../models/user.js";
import {
  isAuthorizedRoom,
  isAuthenticated,
  isAuthenticatedRoom,
} from "../middleware/helper.js";

export const roomRouter = Router();

roomRouter.post("/", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.body.userId1,
      },
    });
    const user2 = await User.findOne({
      where: {
        id: req.body.userId2,
      },
    });
    const isPve = req.body.isPve;
    if (!user2 && !isPve)
      return res.status(404).json({ error: "User not found" });
    const room = await Room.create({
      gameType: req.body.gameType,
      status: req.body.status,
      userId1: req.body.userId1,
      userId2: isPve ? "pveGame" : req.body.userId2,
      isPve: isPve,
      user1Status: isPve ? "pve" : "pending",
      user2Status: isPve ? "pve" : "pending",
      questionTitleSlug: req.body.questionTitleSlug,
      user1Nickname: user.nickname,
      user2Nickname: isPve ? "pveGame" : user2.nickname,
    });
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    const user = await User.findOne({
      where: {
        accessToken: token,
      },
    });
    const isPve = room.isPve;
    if (user.id === room.userId1) {
      const user2 = await User.findOne({
        where: {
          id: room.userId2,
        },
      });
      return res.json({
        id: room.id,
        status: room.status,
        isPve: room.isPve,
        socketId1: user.socketId,
        socketId2: isPve ? "pveGame" : user2.socketId,
        playerTitle: "p1",
        userId1: room.userId1,
        timeElapsed: room.timeElapsed,
        userId2: room.userId2,
        questionTitleSlug: room.questionTitleSlug,
        gameType: room.gameType,
        userImg1: user.picture,
        userImg2: isPve ? "pveGame" : user2.picture,
        user1Nickname: user.nickname,
        user2Nickname: isPve ? "pveGame" : user2.nickname,
        user1Attempts: room.user1Attempts,
        user2Attempts: room.user2Attempts,
        userId1: user.id,
        userId2: isPve ? "pveGame" : user2.id,
        user1rank: user.rank,
        user2rank: isPve ? "pveGame" : user2.rank,
        winner: room.winner,
        user1Status: room.user1Status,
        user2Status: room.user2Status,
        user1bp: user.BP,
        user2bp: isPve ? 1000 : user2.BP,
        winner: room.winner,
      });
    }
    const user2 = await User.findOne({
      where: {
        id: room.userId1,
      },
    });
    return res.json({
      id: room.id,
      status: room.status,
      isPve: room.isPve,
      socketId1: isPve ? "pveGame" : user2.socketId,
      socketId2: user.socketId,
      playerTitle: "p2",
      user1Status: room.user1Status,
      user2Status: room.user2Status,
      questionTitleSlug: room.questionTitleSlug,
      gameType: room.gameType,
      timeElapsed: room.timeElapsed,
      userImg1: user2.picture,
      userImg2: user.picture,
      username1: user2.nickname,
      username2: user.nickname,
      user1rank: user2.rank,
      user2rank: user.rank,
      user1Result: room.user1Result,
      user2Result: room.user2Result,
      user1Attempts: room.user1Attempts,
      user2Attempts: room.user2Attempts,
      winner: room.winner,
      user1Nickname: user2.nickname,
      user2Nickname: user.nickname,
      userId1: user2.id,
      userId2: user.id,
      user1bp: user2.BP,
      user2bp: user.BP,
    });
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

roomRouter.put("/:id/playerStatus", isAuthenticated, async (req, res) => {
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
      room.user1Status = req.body.status;
    } else {
      room.user2Status = req.body.status;
    }
    await room.save();
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.put("/:id/time", isAuthenticated, async (req, res) => {
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
    room.timeElapsed = req.body.time;
    await room.save();
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.put("/:id/attempt", isAuthenticated, async (req, res) => {
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
      room.user1Attempts = req.body.attempts;
    } else {
      room.user2Attempts = req.body.attempts;
    }
    await room.save();
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.put("/:id/result", isAuthenticated, async (req, res) => {
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
      room.user1Result = req.body.result;
      room.user1Attempts = room.user1Attempts + 1;
    } else {
      room.user2Result = req.body.result;
      room.user2Attempts = room.user2Attempts + 1;
    }
    await room.save();
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

roomRouter.put("/gameover", async (req, res) => {
  try {
    const room = await Room.findByPk(req.body.roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    room.status = "gameover";
    room.winner = req.body.winner;
    await room.save();
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
    if (req.body.winner === "p1") {
      user1.BP = user1.BP + 50;
      if (!room.isPve) {
        user2.BP = Math.max(user2.BP - 50, 0);
      }
    } else {
      user1.BP = Math.max(user1.BP - 50, 0);
      if (!room.isPve) {
        user2.BP = user2.BP + 50;
      }
    }
    await user1.save();
    await user2.save();
    return res.json(room);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
