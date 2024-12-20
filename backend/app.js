import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { auth } from "express-openid-connect";
import { Server } from "socket.io";
import { sequelize } from "./datasource.js";

import { userRouter } from "./routers/user_router.js";
import { queueRouter } from "./routers/queue_router.js";
import { roomRouter } from "./routers/room_router.js";
import { problemRouter } from "./routers/problem_router.js";
import { leetcodeRouter } from "./routers/leetcode_router.js";
import { leetcodeQueueRouter } from "./routers/leetcodeQueue_router.js";
import { leaderboardRouter } from "./routers/leaderboard_router.js";
import { friendRouter } from "./routers/friend_router.js";
import { apiService } from "./api-service.js";
import dotenv from "dotenv";

const PORT = 3000;
const socketPort = 3001;
export const app = express();

app.use(bodyParser.json());
app.use(express.static("static"));
dotenv.config();

try {
  sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const corsOptions = {
  origin: [
    "https://beat.codes",
    "https://api.beat.codes",
    "http://localhost:4200",
  ],
  credentials: true, //allows cookies and HTTP authentication information to be included in the requests sent to the server
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/queues", queueRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/leetcode", leetcodeRouter);
app.use("/api/friends", friendRouter);
app.use("/api/problems", problemRouter);
app.use("/api/leetcodeQueues", leetcodeQueueRouter);
app.use("/api/leaderboard", leaderboardRouter);
const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [
      "https://beat.codes",
      "https://api.beat.codes",
      "http://localhost:4200",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {

  const createRandomProblem = async () => {
    const problem = await apiService.getRandomProblem();
    if (problem.question.isPaidOnly) {
      return createRandomProblem();
    }
    return problem;
  };

  socket.on("reconnected", function (userId, accessToken) {
    socket.emit("reconnected", userId, socket.id);
  });

  socket.on("reduce", function (data) {
    const { roomId, playerTo } = data;
    io.to(playerTo).emit("reduce", roomId);
  });

  socket.on(
    "opponent_reconnected",
    (roomId, title, socketId, toSocketId, token) => {
      io.to(toSocketId).emit("opponent_reconnected", title, socketId, roomId);
    },
  );

  const token = socket.handshake.query.token;
  socket.on("online", function (data) {
    const { userId, friendSocketId } = data;
    io.to(friendSocketId).emit("friend online", userId);
  });

  socket.on("new friend", function (data) {
    const { friendId, friendSocketId } = data;
    io.to(friendSocketId).emit("new friend added", friendId);
  });

  socket.on("editor", function (data) {
    const { targetSocketId, code } = data;
    // Using 'to' to emit to a specific socket by its ID
    io.to(targetSocketId).emit("editor", { code });
  });

  socket.on("change language", function (data) {
    const { targetSocketId, language } = data;
    io.to(targetSocketId).emit("opponent change language", { language });
  });
  // const token = 'Bearer ' + socket.handshake.headers.authorization;
  socket.on("matching", async function (userId, accessToken, gameType) {
    // Make this function async
    if (gameType === "normal") {
      await apiService.enqueue(userId, accessToken, socket.id);
      const queueRes = await apiService.getQueue();
      if (queueRes.count >= 2) {
        for (let i = 0; i < queueRes.queue.length; i = i + 2) {
          if (
            queueRes.queue[i + 1] &&
            queueRes.queue[i + 1].userId !== queueRes.queue[i].userId
          ) {
            // Ensure there's a pair

            const player1 = await apiService.dequeue(
              queueRes.queue[i].socketId,
              accessToken,
            );

            const player2 = await apiService.dequeue(
              queueRes.queue[i + 1].socketId,
              accessToken,
            );
            const problem = await apiService.getRandomProblem();

            const pair = await apiService.createRoom(
              "created",
              player1.userId,
              player2.userId,
              accessToken,
              false,
              problem.question.titleSlug,
              "normal",
            );

            io.to(player1.socketId).emit("matched", pair, player1);
            io.to(player2.socketId).emit("matched", pair, player2);

            await apiService.deleteQueue(queueRes.queue[i].socketId, token);
            await apiService.deleteQueue(queueRes.queue[i + 1].socketId, token);
          } else {
            const player1 = await apiService.dequeue(
              queueRes.queue[i].socketId,
              accessToken,
            );
            await apiService.deleteQueue(queueRes.queue[i].socketId);
          }
        }
      }
    } else {
      await apiService.leetcodeEnqueue(userId, accessToken, socket.id); // Assuming you handle the response inside the enqueue function
      const leetcodeQueueRes = await apiService.getLeetcodeQueue();
      if (leetcodeQueueRes.count >= 2) {
        for (let i = 0; i < leetcodeQueueRes.queue.length; i = i + 2) {
          if (
            leetcodeQueueRes.queue[i + 1] &&
            leetcodeQueueRes.queue[i + 1].userId !==
              leetcodeQueueRes.queue[i].userId
          ) {
            // Ensure there's a pair
            const player1 = await apiService.leetcodeDequeue(
              leetcodeQueueRes.queue[i].socketId,
              accessToken,
            );

            const player2 = await apiService.leetcodeDequeue(
              leetcodeQueueRes.queue[i + 1].socketId,
              accessToken,
            );

            createRandomProblem().then((problem) => {
              apiService
                .createRoom(
                  "created",
                  player1.userId,
                  player2.userId,
                  accessToken,
                  false,
                  problem.question.titleSlug,
                  "leetcode",
                )
                .then((pair) => {
                  io.to(player1.socketId).emit("matched", pair, player1);
                  io.to(player2.socketId).emit("matched", pair, player2);

                  apiService.deleteLeetcodeQueue(
                    leetcodeQueueRes.queue[i].socketId,
                    token,
                  );
                  apiService.deleteLeetcodeQueue(
                    leetcodeQueueRes.queue[i + 1].socketId,
                    token,
                  );
                });
            });
          } else {
            const player1 = await apiService.leetcodeDequeue(
              leetcodeQueueRes.queue[i].socketId,
              accessToken,
            );
            await apiService.deleteLeetcodeQueue(
              leetcodeQueueRes.queue[i].socketId,
            );
          }
        }
      }
    }
  });

  socket.on("accepted", function (data, userId, token) {
    apiService.setPlayerStatus(data.id, "accepted", token).then((res) => {
      apiService.getRoom(data.id, token).then((pair) => {
        io.fetchSockets().then((data) => {
          const socketIds = data.map((socket) => socket.id);
          if (
            socketIds.includes(pair.socketId1) &&
            socketIds.includes(pair.socketId2)
          ) {
            if (
              pair.user1Status === "accepted" &&
              pair.user2Status === "accepted"
            ) {
              io.to(pair.socketId1).emit("start", pair.id, pair.userId1, "p1");
              io.to(pair.socketId2).emit("start", pair.id, pair.userId2, "p2");
            }
          } else {
            if (pair.socketId1 in socketIds) {
              apiService.enqueue(pair.userId1, token, pair.socketId1);
            } else {
              apiService.enqueue(pair.userId2, token, pair.socketId2);
            }
          }
        });
      });
    });
  });

  socket.on("game over", async function (data) {
    const { roomId, token, playerTitle } = data;
    const room = await apiService.getRoom(roomId, token);
    if (room) {
      if (playerTitle === "p1") {
        io.to(room.socketId2).emit("game terminated by opponent");
      } else {
        io.to(room.socketId1).emit("game terminated by opponent");
      }
    }
  });

  socket.on("logout", async function (data) {
    const id = data;
    apiService.getFriendsById(id).then((friends) => {
      friends.forEach((friend) => {
        io.to(friend.socketId).emit("friend offline", id);
      });
    });
  });

  socket.on("disconnect", () => {
    apiService.deleteQueue(socket.id, token).then((res) => {});
    apiService.deleteLeetcodeQueue(socket.id, token).then((res) => {});
    apiService.clearUserSocket(socket.id, token).then((res) => {
      apiService.getFriendsById(res.id).then((friends) => {
        friends.forEach((friend) => {
          io.to(friend.socketId).emit("friend offline", res.id);
        });
      });
    });
  });
});

app.use(function (req, res, next) {
  res.io = io;
  next();
});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL_FRONTEND,
  clientID: "Kmosk0ISBss1diEABRcTzKJwNceZpSqn",
  issuerBaseURL: "https://dev-jqe0hc4zidat2q1z.us.auth0.com",
};

app.use(auth(config));

app.get("/profile", (req, res) => {
  res.send(
    req.oidc.isAuthenticated() ? JSON.stringify(req.oidc.user) : "Logged out",
  );
});

app.get("/connect", (req, res) => res.oidc.login({ returnTo: "/sign-in" }));

httpServer.listen(PORT, () => {
  console.log("server on https://beat.codes:%s", PORT);
});
