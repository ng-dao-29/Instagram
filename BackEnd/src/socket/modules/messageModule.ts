import {Rooms} from "../../model/Room";
import {AppDataSource} from "../../config/data-source";

const RoomRepository = AppDataSource.getRepository(Rooms);
module.exports = (io, socket) => {

    const joinRoom = (data) => {
        socket.join(data);
    }

    const sendMessage = async (dataMessage) => {
        let chatId = dataMessage.room.id;
        let dataChat = await RoomRepository.find({
            relations: {
                users: true,
            },
            where: {id: chatId}
        });

        dataChat[0].users.forEach(user => {
            if (user.id !== dataMessage.author.id) {
                socket.in(user.id).emit("take-message", dataMessage);
            }
        })
    }
    socket.on("join-room", joinRoom);
    socket.on("send-message", sendMessage);
}