import { LeetcodeQueue } from "../models/leetcodeQueue.js";
import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middleware/helper.js";

export const leetcodeQueueRouter = Router();

leetcodeQueueRouter.post("/enqueue", isAuthorized, async (req, res) => {
  try {
    console.log("\n\n\n\n\nReached enqueue\n\n\n\n\n");
    const queue = await LeetcodeQueue.create({
      userId: req.body.userId,
      socketId: req.body.socketId,
    });
    return res.json(queue);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeQueueRouter.post("/dequeue", isAuthenticated, async (req, res) => {
  try {
    const queue = await LeetcodeQueue.findOne({
      where: {
        socketId: req.body.socketId,
      },
    });
    return res.json(queue);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeQueueRouter.delete("/:id", async (req, res) => {
  try {
    const queue = await LeetcodeQueue.destroy({
      where: {
        socketId: req.params.id,
      },
    });
    return res.json(queue);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

leetcodeQueueRouter.get("/", async (req, res) => {
  try {
    const queue = await LeetcodeQueue.findAll();
    const count = await LeetcodeQueue.count();
    return res.json({ queue, count });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
