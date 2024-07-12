import { User } from "../models/user.js";
import { Router } from "express";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
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
                username: req.body.username,
                password: req.body.password,
            },
        });
        if (user) {
            return res.json(user);
        } else {
            return res.status(400).json({ error: "User not found" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});