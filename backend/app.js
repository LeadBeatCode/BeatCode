import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { User } from "./models/user.js";
import { sequelize } from "./datasource.js";
import { Queue } from "./models/queue.js";

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

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on('matching', function(info) {
      console.log('matching', socket.id);
      info.socketId = socket.id;
      queue.push(info);
      while (queue.length >= 2) {
        const player1 = queue.shift();
        player1.title = "player1"
        const player2 = queue.shift();
        player2.title = "player2"
        io.emit('matched', player1, player2);
      }
    });
});

app.use( function (req, res, next) {
  res.io = io;
  next();
});


app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

httpServer.listen(socketPort, () => {
  console.log("Socket server on http://localhost:%s", socketPort);
});