import * as dotenv from "dotenv";

dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import Token from "./src/middlewares/jwt.middleware";
import {AppDataSource} from "./src/config/data-source";
import {Post} from "./src/router/postRouter";
import {router} from "./src/router/userRouter";
import {chatRouter} from "./src/router/chatRouter";
import {messageRouter} from "./src/router/messageRouter";
import {notificationRouter} from "./src/router/notificationRouter";

const messageHandlers = require("./src/socket/modules/messageModule");
const notificationHandlers = require("./src/socket/modules/notification");
const activeStatusHandlers = require("./src/socket/modules/activeStatusHandlers");
import {Server} from "socket.io";

const PORT = process.env.PORT || 8080;

// thiết lập kết nối cơ sở dữ liệu
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err.message);
    });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", router);
app.use(Token.veryfyAccessToken);
app.use("/api/v1", Post);
app.use("/api/v1", chatRouter);
app.use("/api/v1", messageRouter);
app.use("/api/v1", notificationRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: err.status || 500,
        message: err.message,
    });
});

const server = app.listen(PORT, () => {
    console.log("App running with port: " + PORT);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const onConnection = (socket) => {
    activeStatusHandlers(io, socket);
    messageHandlers(io, socket);
    notificationHandlers(io, socket);
};

io.on("connection", onConnection);
