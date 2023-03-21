import {User} from "../model/User";
import {Rooms} from "../model/Room";
import {Messages} from "../model/Messages";
import {AppDataSource} from "../config/data-source";
import {chatRouter} from "../router/chatRouter";

const UserRepository = AppDataSource.getRepository(User);
const RoomRepository = AppDataSource.getRepository(Rooms);
const MessageRepository = AppDataSource.getRepository(Messages);

class Chat {
    async getDataChat(req, res) {
        try {
            let dataUser = req.user.data;
            let chatId = req.params.id;
            let dataChat = await RoomRepository.find({
                relations: {
                    users: true,
                },
                where: {id: chatId},
            });
            let chat = dataChat[0];
            let avatars = [];
            if (chat.status === "private") {
                chat.users.forEach((user) => {
                    if (user.id !== dataUser.id) {
                        avatars.push(user.profile_picture);
                        chat.roomName = user.name;
                        chat.avatar = avatars;
                        chat.online = user.online;
                        chat.last_activity = user.last_activity;
                    }
                });
            }
            let dataMessage = await MessageRepository.find({
                relations: {
                    author: true,
                },
                where: {
                    room: {id: chatId},
                },
            });
            res.status(200).json({
                success: true,
                dataChat: chat,
                dataMessage: dataMessage,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }

    async findCreateChat(req, res) {
        try {
            let user = req.user.data;
            let userChat = await UserRepository.findOneBy({
                id: req.body.userIdChat[0],
            });
            let ChatName = user.id + ":" + userChat.id;
            let chatData = await RoomRepository.find({
                relations: {
                    users: true,
                },
                where: {
                    roomName: ChatName,
                },
            });

            if (chatData.length < 1) {
                ChatName = userChat.id + ":" + user.id;
                chatData = await RoomRepository.find({
                    relations: {
                        users: true,
                    },
                    where: {
                        roomName: ChatName,
                    },
                });
            }

            if (chatData.length < 1) {
                let newChat = new Rooms();
                newChat.roomName = ChatName;
                newChat.users = [user, userChat];
                newChat.avatar = "";
                let ChatData = await RoomRepository.save(newChat);
                res.status(200).json({
                    success: true,
                    chatData: ChatData,
                });
            } else {
                res.status(200).json({
                    success: true,
                    dataChat: chatData[0],
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async getListChat(req, res) {
        try {
            let dataUser = req.user.data;
            let userChat = await UserRepository.find({
                where: {
                    id: dataUser.id,
                },
                relations: {
                    rooms: true,
                },
            });
            let listChat = userChat[0].rooms;
            let dataListChat = [];
            for (let i = 0; i < listChat.length; i++) {
                let dataChat = await RoomRepository.find({
                    where: {
                        id: listChat[i].id,
                    },
                    relations: {
                        users: true,
                    },
                });
                let chat = dataChat[0];
                let avatars = [];
                if (chat.status === "private") {
                    chat.users.forEach((user) => {
                        if (user.id !== dataUser.id) {
                            avatars.push(user.profile_picture);
                            chat.roomName = user.name;
                            chat.avatar = avatars;
                            chat.online = user.online;
                            chat.last_activity = user.last_activity;
                            dataListChat.push(chat);
                        }
                    });
                }
            }
            res.status(200).json({
                success: true,
                listChat: dataListChat,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async createChatGroup(req, res) {
        try {
            let user = req.user.data;
            let listUserId = req.body.listUserId;
            let listUser = [];
            listUser.push(user);
            for (let i = 0; i < listUserId.length; i++) {
                let userChat = await UserRepository.findOneBy({id: listUserId[i]});
                listUser.push(userChat);
            }
            let newGroupChat = new Rooms();
            newGroupChat.roomName = "";
            newGroupChat.status = "group";
            newGroupChat.users = listUser;
            newGroupChat.Admin = user;
            let dataGroupChat = await RoomRepository.save(newGroupChat);
            if (dataGroupChat) {
                res.status(200).json({
                    success: true,
                    dataGroup: dataGroupChat,
                });
            }
        } catch (error) {
        }
    }

    async removeFromGroup(req, res) {
        let userIdRemove = req.body.userIdRemove;
        let GroupChatId = req.body.groupChatId;
    }

    async addToGroup(res, req) {
    }
}

export default new Chat();
