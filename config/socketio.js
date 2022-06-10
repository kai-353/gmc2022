let io;
exports.socketConnection = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });
  io.on("connection", (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on("joinGroup", (group) => {
      console.log("joining: " + group);
      socket.join(group);
    });

    socket.on("leaveGroup", (group) => {
      console.log("leaving: " + group);
      socket.leave(group);
    });

    socket.on("disconnect", () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

exports.sendMessage = (message) => io.emit("message", message);

exports.socketEmit = (to, message) => {
  console.log(to, message);
  io.to(to).emit(message);
};

exports.test = () => {
  io.sockets.sockets.forEach((socket) => {
    // console.log(socket.rooms.size);
    if (socket.rooms.size < 2) {
      io.to(socket.id).emit("connectToRoom");
    }
  });
};

exports.getRooms = () => io.sockets.adapter.rooms;
