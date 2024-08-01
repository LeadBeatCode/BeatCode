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
  console.log("a user connected");

  const createRandomProblem = async () => {
    const problem = await apiService.getRandomProblem();
    console.log("hohoho", problem.question.isPaidOnly, problem.question.titleSlug);
    if (problem.question.isPaidOnly) {
      return createRandomProblem();
    }
    return problem;
  };

  socket.on("reconnected", function (userId, accessToken) {
    socket.emit("reconnected", userId, socket.id);
  });

  socket.on(
    "opponent_reconnected",
    (roomId, title, socketId, toSocketId, token) => {
      console.log("opponent_reconnected", roomId, title);
      io.to(toSocketId).emit("opponent_reconnected", title, socketId, roomId);
    },
  );

  const token = socket.handshake.query.token;
  // console.log("token at 70", socket.handshake.query);
  socket.on("online", function (data) {
    const { userId, friendSocketId } = data;
    // console.log("online", userId, friendSocketId);
    io.to(friendSocketId).emit("friend online", userId);
  });

  socket.on("new friend", function (data) {
    const { friendId, friendSocketId } = data;
    // console.log("new friend", friendId, friendSocketId);
    io.to(friendSocketId).emit("new friend added", friendId);
  });

  socket.on("editor", function (data) {
    const { targetSocketId, code } = data;
    // Using 'to' to emit to a specific socket by its ID
    io.to(targetSocketId).emit("editor", { code });
  });

  socket.on("change language", function (data) {
    const { targetSocketId, language } = data;
    console.log("change language", targetSocketId, language);
    io.to(targetSocketId).emit("opponent change language", { language });
  });
  // const token = 'Bearer ' + socket.handshake.headers.authorization;
  socket.on("matching", async function (userId, accessToken, gameType) {
    // Make this function async
    console.log("matching", userId);
    if (gameType === "normal") {
      await apiService.enqueue(userId, accessToken, socket.id);
      const queueRes = await apiService.getQueue();
      console.log("queue", queueRes);
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
            console.log("matched", pair);

            await apiService.deleteQueue(queueRes.queue[i].socketId, token);
            await apiService.deleteQueue(queueRes.queue[i + 1].socketId, token);
            console.log("delete", "success"); // Assuming deleteQueue works as expected
          } else {
            const player1 = await apiService.dequeue(
              queueRes.queue[i].socketId,
              accessToken,
            );
            await apiService.deleteQueue(queueRes.queue[i].socketId);
            console.log("delete", "success");
          }
        }
      }
    } else {
      await apiService.leetcodeEnqueue(userId, accessToken, socket.id); // Assuming you handle the response inside the enqueue function
      const leetcodeQueueRes = await apiService.getLeetcodeQueue();
      console.log("leetcodeQueue", leetcodeQueueRes);
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
              console.log("ohohoh", problem)
              apiService.createRoom(
                "created",
                player1.userId,
                player2.userId,
                accessToken,
                false,
                problem.question.titleSlug,
                "leetcode",
              ).then((pair) => {
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
                console.log("delete", "success"); // Assuming deleteQueue works as expected
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
            console.log("delete", "success");
          }
        }
      }
    }
  });

  socket.on("accepted", function (data, userId, token) {
    console.log("accepted", data, userId);
    apiService.setPlayerStatus(data.id, "accepted", token).then((res) => {
      console.log("accepted");
      apiService.getRoom(data.id, token).then((pair) => {
        io.fetchSockets().then((data) => {
          const socketIds = data.map((socket) => socket.id);
          console.log("socketIds", socketIds);
          console.log(
            "in if statement",
            pair.socketId1,
            pair.socketId2,
            socketIds.includes(pair.socketId1),
            socketIds.includes(pair.socketId2),
          );
          if (
            socketIds.includes(pair.socketId1) &&
            socketIds.includes(pair.socketId2)
          ) {
            if (
              pair.user1Status === "accepted" &&
              pair.user2Status === "accepted"
            ) {
              console.log("both accepted and in socketIds");
              io.to(pair.socketId1).emit("start", pair.id, pair.userId1, "p1");
              io.to(pair.socketId2).emit("start", pair.id, pair.userId2, "p2");
            }
          } else {
            const tempSocketIds = pair.socketId1;
            console.log("tempSocketIds", tempSocketIds);
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
    const { roomId, token } = data;
    const room = await apiService.getRoom(roomId, token);
    if (room) {
      if (room.winner === "p1") {
        console.log("p1 won", room.socketId2);
        io.to(room.socketId2).emit("game won by opponent", "p1won");
      } else {
        console.log("p2 won", room);
        io.to(room.socketId1).emit("game won by opponent", "p2won");
      }
    }
  });

  socket.on("logout", async function (data) {
    console.log("logout", data);
    const id = data;
    apiService.getFriendsById(id).then((friends) => {
      friends.forEach((friend) => {
        console.log("friend", friend.socketId);
        io.to(friend.socketId).emit("friend offline", id);
      });
    });
  });

  // const userId = socket.handshake.headers.userId;
  // console.log("token at 231", token);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    apiService.deleteQueue(socket.id, token).then((res) => {
      console.log("deleteQueue", res);
    });
    apiService.deleteLeetcodeQueue(socket.id, token).then((res) => {
      console.log("deleteLeetcodeQueue", res);
    });
    console.log("setUserSocket", socket.id);
    apiService.clearUserSocket(socket.id, token).then((res) => {
      apiService.getFriendsById(res.id).then((friends) => {
        console.log("friends", friends);
        friends.forEach((friend) => {
          console.log("friend", friend.socketId);
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

// app.listen(PORT, (err) => {
//   if (err) console.log(err);
//   else console.log("HTTP server on hhttps://beat.codes:%s", PORT);
// });

httpServer.listen(PORT, () => {
  console.log("server on https://beat.codes:%s", PORT);
});
