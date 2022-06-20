const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");

const { socketConnection, test } = require("./config/socketio");
const { errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();
const server = http.createServer(app);
socketConnection(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/assignments", require("./routes/assignment"));
app.use("/test", require("./routes/test"));
app.get("/image/:resource", (req, res) => {
  res.sendFile(path.join(__dirname, "/assets/", req.params.resource));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);
const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log(`Server running on  ${PORT}`));

setInterval(() => test(), 2000);
