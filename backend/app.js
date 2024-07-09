import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const PORT = 3000;
const socketPort = 3001;
export const app = express();

const httpServer = http.createServer(app);
app.use(bodyParser.json());

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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
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