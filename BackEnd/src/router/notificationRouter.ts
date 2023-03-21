import {Router} from "express";
import notificationController from "../controllers/notification.controller";

export const notificationRouter = Router();
notificationRouter.get("/notification", notificationController.getNotification);
notificationRouter.post(
    "/notification",
    notificationController.sendNotification
);
notificationRouter.get("/notification/setup/:id", notificationController.setupNotifications)
notificationRouter.get("/notification/new", notificationController.getNewNotification)