import Chat from "../models/chat.js";
import { Server } from "socket.io";
import server from "../server.js";


export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    },
});

export default () => {
    io.on("connection", (socket) =>{
        console.log("Client connected");
        socket.on("send", async (message) =>{
            console.log(message);
            
            await Chat.create(message);

            socket.broadcast.emit("receive", message);
        });
    });
};