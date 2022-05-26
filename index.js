const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");

const { socketConnection } = require("./config/socketio");
const { errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();
const server = http.createServer(app);
socketConnection(server);

app.get("/", (req, res) => {
  res.sendFile("/Users/kaideumers/Desktop/Github/gmc2022/index.html");
});

app.use(express.urlencoded({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/assignment", require("./routes/assignment"));
app.use("/test", require("./routes/test"));

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server running on  ${PORT}`));
