const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const cors = require("cors");

const aa_sqlite = require("aa-sqlite");

const port = 5000;

const app = express();

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

app.get("/api/", (req, res) => {
  res.send({ response: "api" }).status(200);
});

app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let interval;

io.on("connection", async (socket) => {
  socketConnected();
  await aa_sqlite.open("./book4.db");
  var alldata = await aa_sqlite.all("SELECT * FROM liq");

  socket.emit("FromAPI", alldata);

  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => sendData(socket), 1000);

  socket.on("disconnect", () => {
    socketDisConnected();
    clearInterval(interval);
  });
});

function socketConnected() {
  console.log("New client connected");
}

function socketDisConnected() {
  console.log("Client disconnected");
}

const sendData = (socket) => {
  socket.emit("FromAPI", global_res);
};

var global_res = [
  {
    time: Date.now(),
    asks: JSON.stringify({}),
    bids: JSON.stringify({}),
  },
];

server.listen(port, () => console.log(`Listening on port ${port}`));
