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

    socket.on("groupnumber", (groupNumber) => {
      const nowDate = new Date();
      const maxDate = new Date("2022-07-04T11:15:00.000+00:00");
      if (nowDate.getTime() > maxDate.getTime() && groupNumber < 299) {
        io.emit("refreshAll");
      }
    });
  });
};

exports.sendMessage = (message) => io.emit("message", message);

exports.socketEmit = (to, message, title) => {
  console.log(to, message, title);
  io.to(to).emit(message, title);
};

exports.refreshAll = () => {
  io.emit("refreshAll");
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
