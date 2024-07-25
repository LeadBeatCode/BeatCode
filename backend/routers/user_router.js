import { User } from "../models/user.js";
import { Router } from "express";

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
        console.log("logging user", user);
        return res.json(user);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.body.userData.sub,
            },
        });
        if (user) {
            user.set("socketId", req.body.socketId);
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
        return res.json({nickname: user.nickname, socketId: user.socketId, rank: user.rank});
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
