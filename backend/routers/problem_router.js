import { Router } from 'express';
import { Problem } from '../models/problem.js';

export const problemRouter = Router();

problemRouter.post('/', async (req, res) => {
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