import { Router } from 'express';
import { Pair } from '../models/pair.js';

export const pairRouter = Router();

pairRouter.post('/', async (req, res) => {
    try {
        const pair = await Pair.create({
            userId1: req.body.userId1,
            userId2: req.body.userId2,
            status: req.body.status,
        });
        return res.json(pair);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

pairRouter.get('/', async (req, res) => {
    try {
        const pair = await Pair.findAll();
        return res.json(pair);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

pairRouter.get('/:id', async (req, res) => {
    try {
        const pair = await Pair.findByPk(req.params.id);
        return res.json(pair);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

pairRouter.delete('/:id', async (req, res) => {
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