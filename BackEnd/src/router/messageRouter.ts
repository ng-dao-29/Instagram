import Token from "../middlewares/jwt.middleware";
import {Router} from 'express';
import MessageController from "../controllers/messager.controller";

export const messageRouter = Router();
messageRouter.use(Token.veryfyAccessToken)
messageRouter.post('/message/send', MessageController.sendMessage);
messageRouter.get("/message/get", MessageController.getMessage);

