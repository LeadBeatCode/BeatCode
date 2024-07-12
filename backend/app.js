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
  
  socket.on('editor', function(data) {
    const { targetSocketId, code } = data;
    // Using 'to' to emit to a specific socket by its ID
    io.to(targetSocketId).emit('editor', { code });
  });

  socket.on('matching', async function(data) { // Make this function async
  console.log('matching', data);
  await apiService.enqueue(data, socket.id); // Assuming you handle the response inside the enqueue function
  const queueRes = await apiService.getQueue();
  console.log('queue', queueRes);
  if (queueRes.count >= 2) {
    // while (count >= 2) {
    for (let i = 0; i < queueRes.queue.length; i = i+2) {
      if (queueRes.queue[i + 1] && queueRes.queue[i + 1].userId !== queueRes.queue[i].userId) { // Ensure there's a pair
        console.log('dequeue', queueRes.queue[i]);

        const player1 = await apiService.dequeue(queueRes.queue[i].socketId);
        //player1.title = "player1"
        console.log('dequeue just the res', queueRes.queue);
        console.log('dequeue, increment', queueRes.queue[i+1], i+1);

        const player2 = await apiService.dequeue(queueRes.queue[i+1].socketId); 
        //player2.title = "player2"
        const pair = await apiService.createPair(player1.userId, player2.userId, player1.socketId, player2.socketId);
        io.to(player1.socketId).emit('matched', pair, player1);
        io.to(player2.socketId).emit('matched', pair, player2);
        console.log('matched', pair);
        //socket.to(player2.socketId).emit('matched', player1, player2);

        await apiService.deleteQueue(queueRes.queue[i].socketId);
        await apiService.deleteQueue(queueRes.queue[i+1].socketId);
        console.log('delete', 'success'); // Assuming deleteQueue works as expected
      } else {
        const player1 = await apiService.dequeue(queueRes.queue[i].socketId);
        await apiService.deleteQueue(queueRes.queue[i].socketId);
        console.log('delete', 'success');
      }
    }
  }
  });
  socket.on('accepted', function(data, userId) {
    //console.log('accepted', data, userId);
    apiService.setPlayerStatus(data.id, true, userId.userId).then((res) => {
      console.log('accepted', res);
      apiService.getPair(data.id).then(pair => {
        io.fetchSockets().then(data => {
          const socketIds = data.map(socket => socket.id);
          console.log('socketIds', socketIds);
          //console.log('in if statement', pair.socketId1, pair.socketId2, socketIds.includes(pair.socketId1), socketIds.includes(pair.socketId2));
          if (socketIds.includes(pair.socketId1) && socketIds.includes(pair.socketId2)) {
            if (pair.p1status && pair.p2status) {
              apiService.createRoom(true, pair.userId1, pair.userId2, pair.socketId1, pair.socketId2).then((res) => {
                console.log('room', res.id);
                io.to(pair.socketId1).emit('start', res.id, pair.userId1);
                io.to(pair.socketId2).emit('start', res.id, pair.userId2);
              });
            } 
          } else {
            const tempSocketIds = pair.socketId1;
            console.log('tempSocketIds', tempSocketIds);
            if (pair.socketId1 in socketIds) {
              apiService.enqueue(data, pair.socketId1)
            } else {
              apiService.enqueue(data, pair.socketId2)
            }
          }
        });
      });
    });
  });

  // socket.on('matching', async function(data) {
  //   console.log('matching', data);
  //   await apiService.enqueue(data, socket.id).then((res) => {
  //     console.log('enqueue', res);
  //     await apiService.getQueue().then((queueRes) => {
  //       console.log('queue', queueRes);
  //       if (queueRes.count >= 2) {
  //         let count = queueRes.count;
  //         let increment = 0;
  //         // while (count >= 2) {
  //         for (let i = 0; i < queueRes.queue.length; i = i+2) {
  //           console.log('dequeue', queueRes.queue[i]);
  //           const socketId2 = queueRes.queue[i+1].socketId;
  //           await apiService.dequeue(queueRes.queue[i].socketId).then((player1Res) => {
  //             const player1 = player1Res;
  //             player1.title = "player1"
  //             console.log('dequeue just the res', queueRes.queue);
  //             console.log('dequeue, increment', queueRes.queue[i+1], i+1);
  //             apiService.dequeue(queueRes.socketId2).then((player2Res) => {
  //               const player2 = player2Res;
  //               player2.title = "player2"
  //               apiService.createPair(player1.userId, player2.userId).then((res) => {
  //                 socket.to(player1.socketId).emit('matched', player1, player2);
  //                 socket.to(player2.socketId).emit('matched', player1, player2);
  //               });

  //               apiService.deleteQueue(queueRes.queue[i].socketId).then((res) => {
  //                 console.log('delete', res);
  //               });
  //               apiService.deleteQueue(queueRes.socketId2).then((res) => {
  //                 console.log('delete', res);
  //               });
  //             });
  //           });
  //           count = count - 2;
  //           increment = increment + 2;
  //         }
  //       }
  //     });
  //   });
      
  //   });
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