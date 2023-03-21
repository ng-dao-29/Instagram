import Chat from '../controllers/chat.controller';
import Token from "../middlewares/jwt.middleware";
import {Router} from 'express';

export const chatRouter = Router()
chatRouter.use(Token.veryfyAccessToken);
chatRouter.post('/chat/new', Chat.findCreateChat);
chatRouter.get('/chat/list', Chat.getListChat);
chatRouter.post('/chat/group/new', Chat.createChatGroup);
chatRouter.get("/chat/:id", Chat.getDataChat)
