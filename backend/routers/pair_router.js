import { Router } from "express";
import { Pair } from "../models/pair.js";

export const pairRouter = Router();

pairRouter.post("/", async (req, res) => {
  try {
    const token1 = req.headers.authorization1.split(" ")[1];
    const token2 = req.headers.authorization2.split(" ")[1];
    const pair = await Pair.create({
      token1: token1,
      token2: token2,
      socketId1: req.body.socketId1,
      socketId2: req.body.socketId2,
      p1status: false,
      p2status: false,
    });
    return res.json(pair);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

pairRouter.get("/", async (req, res) => {
  try {
    const pair = await Pair.findAll();
    return res.json(pair);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

pairRouter.get("/:id", async (req, res) => {
  try {
    const pair = await Pair.findByPk(req.params.id);
    return res.json(pair);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

pairRouter.delete("/:id", async (req, res) => {
  try {
    const pair = await Pair.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json(pair);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

pairRouter.put("/:id", async (req, res) => {
  try {
    const pair = await Pair.findByPk(req.params.id);
    if (!pair) return res.status(404).json({ error: "Pair not found" });
    const token = req.headers.authorization.split(" ")[1];
    if (pair.token1 === token) {
      pair.set({
        p1status: req.body.status,
      });
      pair.save();
    } else if (pair.token2 === token) {
      pair.set({
        p2status: req.body.status,
      });
      pair.save();
    } else {
      return res.status(400).json({ error: "User not in pair" });
    }
    return res.json(pair);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
