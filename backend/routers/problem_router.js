import { Router } from "express";
import { Problem } from "../models/problem.js";

export const problemRouter = Router();

problemRouter.post("/", async (req, res) => {
  try {
    const problem = await Problem.create({
      title: req.body.title,
      description: req.body.description,
      input1: req.body.input1,
      expectedOutput1: req.body.output1,
      input2: req.body.input2,
      expectedOutput2: req.body.output2,
      input3: req.body.input3,
      expectedOutput3: req.body.output3,
    });
    return res.json(problem);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

problemRouter.get("/random", async (req, res) => {
  try {
    const count = await Problem.count();
    const randomProblemId = Math.floor(Math.random() * count) + 1;
    const problem = await Problem.findOne({
      where: {
        id: randomProblemId,
      },
    });
    return res.json(problem);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

problemRouter.get("/:id", async (req, res) => {
  try {
    console.log("logging req.params.id", req.params.id);
    const problem = await Problem.findByPk(req.params.id);
    console.log("logging problem", problem);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    return res.json(problem);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
