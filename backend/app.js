import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { sequelize } from "./datasource.js";

import { userRouter } from "./routers/user_router.js";
import { queueRouter } from "./routers/queue_router.js";
import { pairRouter } from "./routers/pair_router.js";
import { roomRouter } from "./routers/room_router.js";
import { apiService } from "./api-service.js";


const PORT = 3000;
const socketPort = 3001;
export const app = express();


const httpServer = http.createServer(app);
app.use(bodyParser.json());

try {
  sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true, //allows cookies and HTTP authentication information to be included in the requests sent to the server
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/queues", queueRouter);
app.use("/api/pairs", pairRouter);
app.use("/api/rooms", roomRouter);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const queue = [{uuid: '1'}];
io.on("connection", (socket) => {
  console.log("a user connected");
  const username = generateRandomString(8);
  const password = generateRandomString(8);
  apiService.signup(username, password).then((res) => {
    console.log("signup", res);
    const user = res;
    console.log("logging user", res.id);
    const info = { userId: user.id, socketId: socket.id };
    console.log('info', info);
    socket.on('matching', function() {
        console.log('matching', info);
        apiService.enqueue(info);      
        const queue = apiService.getQueue();
        while (queue.count >= 2) {
          const player1 = apiService.dequeue();
          player1.title = "player1"
          const player2 = apiService.dequeue();
          player2.title = "player2"
  
          apiService.createPair(player1.userId, player2.userId);
          socket.to(player1.socketId).emit('matched', player1, player2);
          socket.to(player2.socketId).emit('matched', player1, player2);
          //io.emit('matched', player1, player2);
        }
      });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

});

app.use( function (req, res, next) {
  res.io = io;
  next();
});

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

httpServer.listen(socketPort, () => {
  console.log("Socket server on http://localhost:%s", socketPort);
});