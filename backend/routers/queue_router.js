import { Queue } from "../models/queue.js";
import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middleware/helper.js";

export const queueRouter = Router();

queueRouter.post("/enqueue", isAuthorized, async (req, res) => {
  try {
    const queue = await Queue.create({
      userId: req.body.userId,
      socketId: req.body.socketId,
    });
    return res.json(queue);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

queueRouter.post("/dequeue", isAuthenticated, async (req, res) => {
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

queueRouter.delete("/:id", async (req, res) => {
  try {
    const queue = await Queue.destroy({
      where: {
        socketId: req.params.id,
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
