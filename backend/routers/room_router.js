import { Router } from "express";
import { Room } from "../models/room.js";

export const roomRouter = Router();

roomRouter.post("/", async (req, res) => {
    try {
        const room = await Room.create({
            status: req.body.status,
            userId1: req.body.userId1,
            userId2: req.body.userId2,
        });
        return res.json(room);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

roomRouter.get("/:id", async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
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