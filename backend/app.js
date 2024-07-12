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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on('matching', function(data) {
    console.log('matching', data);
    apiService.enqueue(data, socket.id).then((res) => {
      console.log('enqueue', res);
      apiService.getQueue().then((queueRes) => {
        console.log('queue', queueRes);
        if (queueRes.count >= 2) {
          let count = queueRes.count;
          let increment = 0;
          // while (count >= 2) {
          for (let i = 0; i < queueRes.queue.length; i++) {
            console.log('dequeue', queueRes.queue[i]);
            
            apiService.dequeue(queueRes.queue[i].socketId).then((player1Res) => {
              const player1 = player1Res;
              player1.title = "player1"
              console.log('dequeue just the res', queueRes.queue);
              console.log('dequeue, increment', queueRes.queue[i+1], i+1);
              apiService.dequeue(queueRes.queue[i+1].socketId).then((player2Res) => {
                const player2 = player2Res;
                player2.title = "player2"
                apiService.createPair(player1.userId, player2.userId).then((res) => {
                  socket.to(player1.socketId).emit('matched', player1, player2);
                  socket.to(player2.socketId).emit('matched', player1, player2);
                });

                apiService.deleteQueue(queueRes.queue[i].socketId).then((res) => {
                  console.log('delete', res);
                });
                apiService.deleteQueue(queueRes.queue[i+1].socketId).then((res) => {
                  console.log('delete', res);
                });
              });
            });
            count = count - 2;
            increment = increment + 2;
          }
        }
      });
    });
      
    });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    apiService.dequeue(socket.id).then((res) => {
      console.log("dequeue", res);
    });
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