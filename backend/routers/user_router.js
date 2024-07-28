import { User } from "../models/user.js";
import { Router } from "express";
import { isAuthenticated } from "../middleware/helper.js";
import { isAuthorized } from "../middleware/helper.js";

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
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

userRouter.put("/rank/:id", isAuthorized, async (req, res) => {
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
      socketId: user.socketId
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

userRouter.put("/socket", isAuthorized, async (req, res) => {
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
    return res.json(user);
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