import { Router } from "express";
import { Friend } from "../models/friend.js";
import { User } from "../models/user.js";
import { Op } from "sequelize";

export const friendRouter = Router();

friendRouter.post("/request", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const user1 = await User.findOne({
      where: {
        accessToken: accessToken,
      },
    });
    const friendCheck = await Friend.findOne({
      where: {
        user1: user1.id,
        user2: req.body.receiverId,
      },
    });
    const friendCheck2 = await Friend.findOne({
      where: {
        user1: req.body.receiverId,
        user2: user1.id,
      },
    });
    if (friendCheck || friendCheck2) {
      return res
        .status(400)
        .json({ error: "Friend already sent or request has been sent" });
    }
    const friend = await Friend.create({
      user1: user1.id,
      user2: req.body.receiverId,
      status: "pending",
    });
    return res.json(friend);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

friendRouter.post("/accept", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const user2 = await User.findOne({
      where: {
        accessToken: accessToken,
      },
    });
    const friend = await Friend.findOne({
      where: {
        user1: req.body.senderId,
        user2: user2.id,
      },
    });
    friend.set("status", "accepted");
    await friend.save();
    const reverseFriend = await Friend.create({
      user1: user2.id,
      user2: req.body.senderId,
      status: "accepted",
    });
    return res.json({ friend, reverseFriend });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

friendRouter.get("/list", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        accessToken: accessToken,
      },
    });
    console.log("user", user.id);
    const friends = await Friend.findAll({
      raw: true,
      where: {
        user1: user.id,
        status: "accepted",
      },
      attributes: [["user2", "friendId"]],
    });
    console.log("friends", friends);
    const friendIds = [];
    for (let i = 0; i < friends.length; i++) {
      console.log("friend", friends[i].friendId);
      friendIds.push(friends[i].friendId);
    }
    const friendInfo = await User.findAll({
      where: {
        id: {
          [Op.in]: friendIds,
        },
      },
      attributes: ["id", "nickname", "rank", "picture"],
    });
    console.log("friendIds", friendIds);
    console.log("friend info", friendInfo);
    return res.json(friendInfo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

friendRouter.get("/list/:id", async (req, res) => {
  try {
    const friends = await Friend.findAll({
      raw: true,
      where: {
        user1: req.params.id,
        status: "accepted",
      },
      attributes: [["user2", "friendId"]],
    });
    const friendIds = [];
    for (let i = 0; i < friends.length; i++) {
      friendIds.push(friends[i].friendId);
    }
    const friendInfo = await User.findAll({
      where: {
        id: {
          [Op.in]: friendIds,
        },
      },
      attributes: ["id", "socketId"],
    });
    return res.json(friendInfo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

friendRouter.get("/pending", async (req, res) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        accessToken: accessToken,
      },
    });
    const friends = await Friend.findAll({
      raw: true,
      where: {
        user2: user.id,
        status: "pending",
      },
      attributes: [["user1", "friendId"]],
    });
    console.log("pending friends", friends);
    //friends.toJSON();
    console.log("pending friends2", friends);
    // const friendIds = friends.map((friend) => friend.friendId);
    const friendIds = [];
    for (let i = 0; i < friends.length; i++) {
      friendIds.push(friends[i].friendId);
    }
    const friendInfo = await User.findAll({
      where: {
        id: {
          [Op.in]: friendIds,
        },
      },
      attributes: ["id", "nickname", "rank", "picture"],
    });
    console.log("pending friendIds", friendIds);
    console.log("pending friend info", friendInfo);
    return res.json(friendInfo);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
