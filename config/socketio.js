let io;
exports.socketConnection = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });
  io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on("joinGroup", (group, tto) => {
      console.log(`${tto ? "tto" : "reg"}:${group}`);
      socket.join(`${tto ? "tto" : "reg"}:${group}`);
    });

    socket.on("disconnect", () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.sendMessage = (message) => io.emit("message", message);

exports.test = () => io.emit("test");

exports.getRooms = () => io.sockets.adapter.rooms;
