import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("message", (message) => {
        console.log(`${socket.id} says ${message}`);
        socket.broadcast.emit("message", message);
    });

    const notifiCation = setInterval(() => {
        let not = "your connection is live";
        socket.broadcast.emit("notification", not);
    }, 10000);

    socket.on("disconnect", () => {
        clearInterval(notifiCation);
    });
});

server.listen(port, () => {
    console.log("server started at port", port);
});
