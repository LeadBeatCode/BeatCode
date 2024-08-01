import { User } from "../models/user.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helper.js";
import { isAuthorized } from "../middleware/helper.js";
import { Room } from "../models/room.js";
import { Op } from "sequelize";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const userData = req.body.userData;
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.create({
      id: userData.sub,
      socketId: req.body.socketId,
      nickname: userData.nickname,
      picture: userData.picture,
      accessToken: token,
    });
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.post("/connect", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.body.userData.sub,
      },
    });
    if (user) {
      if (req.body.socketId) {
        user.set("socketId", req.body.socketId);
      }
      user.set("nickname", req.body.userData.nickname);
      user.set("accessToken", req.headers.authorization.split(" ")[1]);
      user.set("picture", req.body.userData.picture);
      await user.save();
      return res.json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({
      nickname: user.nickname,
      socketId: user.socketId,
      rank: user.rank,
      subrank: user.subrank,
      bp: user.BP,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// userRouter.put("/:nickname/socket", isAuthorized, async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where: {
//         nickname: req.params.nickname,
//       },
//     });
//     if (!user) return res.status(404).json({ error: "User not found" });
//     user.set("socketId", req.body.socketId);
//     await user.save();
//     return res.json(user);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// } )

userRouter.put("/:id/rank", isAuthorized, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.set("rank", req.body.rank);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.get("/:nickname/socket", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        nickname: req.params.nickname,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({
      nickname: user.nickname,
      socketId: user.socketId,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.put("/leetcodecookie", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const cookie = req.body.cookie;
    console.log("cookie", cookie);
    const user = await User.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    user.set("leetcodeCookie", cookie);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.put("/socket", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        id: req.body.userId,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("put socket was called", req.body.socketId);
    user.set("socketId", req.body.socketId);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.put("/clearSocket", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        socketId: req.body.socketId,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log("clear socket was called", req.body.socketId);
    user.set("socketId", "");
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.post("/logout", isAuthorized, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        id: req.body.userId,
      },
    });
    user.set("socketId", "");
    user.set("accessToken", "");
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.get("/performance/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const rooms1 = await Room.findAll({
      where: {
        userId1: req.params.id,
        status: "gameover",
      },
    });
    const rooms2 = await Room.findAll({
      where: {
        userId2: req.params.id,
        status: "gameover",
      },
    });
    const allRooms = [...rooms1, ...rooms2];
    allRooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const firstFiveRooms = allRooms.slice(0, 10);
    const history = await Promise.all(
      firstFiveRooms.map(async (room) => {
        const user1 = await User.findByPk(room.userId1);
        const user2 = await User.findByPk(room.userId2);
        return {
          ...room.toJSON(),
          user1ProfilePicture: user1 ? user1.picture : null,
          user1Nickname: user1 ? user1.nickname : null,
          user2ProfilePicture: user2 ? user2.picture : null,
          user2Nickname: user2 ? user2.nickname : null,
          user1bp: user1 ? user1.BP : null,
          user2bp: user2 ? user2.BP : null,
        };
      }),
    );
    const wins = rooms1.filter((room) => room.winner === "p1").length;
    const losses = rooms1.filter((room) => room.winner === "p2").length;
    const wins2 = rooms2.filter((room) => room.winner === "p2").length;
    const losses2 = rooms2.filter((room) => room.winner === "p1").length;

    return res.json({
      nickname: user.nickname,
      history: history,
      wins: wins + wins2,
      losses: losses + losses2,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
