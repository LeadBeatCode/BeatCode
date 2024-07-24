import { Queue } from "../models/queue.js";
import { Router } from "express";

export const queueRouter = Router();

queueRouter.post("/enqueue", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log('token', token);
        console.log('socketId', req.body.socketId);
        const queue = await Queue.create({
            accessToken: req.headers.authorization.split(" ")[1],
            socketId: req.body.socketId,
        });
        console.log('enqueue', queue);
        return res.json(queue);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

queueRouter.post("/dequeue", async (req, res) => {
    try {
        const queue = await Queue.findOne({
            where: {
                socketId: req.body.socketId,
            },
        });
        return res.json(queue);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

queueRouter.delete("/", async (req, res) => {
    try {
        const queue = await Queue.destroy({
            where: {
                socketId: req.body.socketId,
            },
        });
        return res.json(queue);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

queueRouter.get("/", async (req, res) => {
    try {
        const queue = await Queue.findAll();
        const count = await Queue.count();
        return res.json({ queue, count });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});