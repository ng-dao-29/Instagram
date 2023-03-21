import { AppDataSource } from "../config/data-source";
import { Notification } from "../model/Notification";
const NotificationRepo = AppDataSource.getRepository(Notification);

class notificationController {
  async getNotification(req, res, next) {
    try {
      const notification = await NotificationRepo.find({
        where: {
          userGet: {
            id: req.user.data.id,
          },
        },
        relations: {
          userGet: true,
          userSend: true,
        },
        // order: {
        //   createdAt: "DESC"
        // }
      });
      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNewNotification(req, res, next) {
    try {
      const notification = await NotificationRepo.find({
        where: {
          userGet: {
            id: req.user.data.id,
          },
          read: false,
        },
      });
      res.status(201).json({
        success: true,
        numberNewNotifications: notification.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async setupNotifications(req, res, next) {
    try {
      await NotificationRepo.createQueryBuilder()
        .update(Notification)
        .set({ read: true })
        .where("id = :id", { id: req.params.id })
        .execute();
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendNotification(req, res, next) {
    try {
      if (req.user.data.id !== req.body.userGet) {
        const notificationData = {
          userSend: req.user.data.id,
          userGet: req.body.userGet,
          message: req.body.message,
        };
        const notification = await NotificationRepo.save(notificationData);
        res.status(201).json({
          success: true,
          notification,
        });
      } else {
        res.status(201).json({
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
export default new notificationController();
