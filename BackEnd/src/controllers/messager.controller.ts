import {User} from "../model/User";
import {Rooms} from "../model/Room";
import {Messages} from "../model/Messages";
import {AppDataSource} from "../config/data-source";

const RoomRepository = AppDataSource.getRepository(Rooms);
const MessageRepository = AppDataSource.getRepository(Messages);

class MessageController {
    async sendMessage(req, res) {
        try {
            let roomChatId = req.body.chatId;
            let RoomChat = await RoomRepository.findOneBy({id: roomChatId});
            let user = req.user.data;
            let content = req.body.content;
            let dataMessage = new Messages();
            dataMessage.content = content;
            dataMessage.author = user;
            dataMessage.room = RoomChat;
            let newMessage = await MessageRepository.save(dataMessage);
            res.status(200).json({
                success: true,
                newMessage: newMessage,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getMessage(req, res) {
        try {
            let chatId = req.query.chatId;
            let room = await RoomRepository.findOneBy({id: chatId});
            let dataMessage = await MessageRepository.find({
                relations: {
                    author: true,
                },
                where: {
                    room: room,
                },
            });

            if (dataMessage) {
                res.status(200).json({
                    success: true,
                    dataMessage: dataMessage,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new MessageController();
