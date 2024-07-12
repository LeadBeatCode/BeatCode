import { Router } from 'express';
import { Pair } from '../models/pair.js';

export const pairRouter = Router();

pairRouter.post('/', async (req, res) => {
    try {
        const pair = await Pair.create({
            userId1: req.body.userId1,
            userId2: req.body.userId2,
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

pairRouter.put('/:id', async (req, res) => {
    try {
        const pair = await Pair.findByPk(req.params.id);
        console.log(pair, pair.userId1, pair.userId2, req.body.status);
        if (!pair) return res.status(404).json({ error: 'Pair not found' });
        if (pair.userId1 === req.body.userId) {
            pair.set({
                p1status: req.body.status,
            });
        } else if (pair.userId2 === req.body.userId) {
            pair.set({
                p2status: req.body.status,
            });
            pair.save();
            
        } else {
            return res.status(400).json({ error: 'User not in pair' });
        }
        return res.json(pair);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});