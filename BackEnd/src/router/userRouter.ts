import express from "express";
import UserController from "./../controllers/user.controller";
import Token from "../middlewares/jwt.middleware";

const {uploadAvatar} = require("../utils/awsFunctions");
export const router = express.Router();
const app = express();

router.post("/signup", UserController.signUpUser);
router.post("/login", UserController.loginUser);
router.get("/logout", UserController.logOut);

router.post("/password/forgot", UserController.forgotPassword);
router.put("/password/reset/:token", UserController.resetPassword);

router.use(Token.veryfyAccessToken);

router.put("/update/password", UserController.UpdatePassword);
router.put(
    "/update/profile",
    uploadAvatar.single("avatar"),
    UserController.updateProfile
);

router.get("/follow/:id", UserController.followUser);

router.get("/me", UserController.getAccountDetails);


router.get("/users", UserController.searchUsers);
router.get(
    "/users/suggested",
    UserController.suggestedUsers
);
router.get(
    "/userdetails/:id",
    UserController.getUserDetailsById
);
router.get("/user/:username", UserController.getUserDetail);