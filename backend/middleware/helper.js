import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!user)
      return res.status(401).json({ error: "Unauthenticated, please log in" });
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const isAuthorized = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!user)
      return res.status(401).json({ error: "Unauthenticated, please log in" });
    if (user.id !== req.params.id && user.id !== req.body.userId) {
      return res.status(403).json({ error: "User not authorized" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const isAuthorizedRoom = async (req, res, next) => {
  try {
    const token1 = req.headers.authorization1.split(" ")[1];
    const token2 = req.headers.authorization2.split(" ")[1];
    const isPve = req.body.isPve;
    if (!isPve && !token1 && !token2) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (isPve && !token1) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user1 = await User.findOne({
      where: {
        accessToken: token1,
      },
    });
    const user2 = isPve
      ? "pveGame"
      : await User.findOne({
          where: {
            accessToken: token2,
          },
        });
    if (!isPve && (!user1 || !user2)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (isPve && !user1) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const isAuthenticatedRoom = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findOne({
      where: {
        accessToken: token,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthenticated, please log in" });
    }

    if (
      user.id !== req.body.userId1 &&
      user.id !== req.body.userId2 &&
      user.id !== req.params.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
