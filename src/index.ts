import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import router from "./routes/index.route";
import { registerSocketEvents } from "./sockets/game.socket";

const app = express();
const server = http.createServer(app);

// CORS middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use("/api", router);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

registerSocketEvents(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
