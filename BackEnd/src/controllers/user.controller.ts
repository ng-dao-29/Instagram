import {Follow} from "../model/Follow";
import {User} from "../model/User";
import createError from "http-errors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {AppDataSource} from "../config/data-source";
import Token from "../middlewares/jwt.middleware";
import {sendEmail} from "../utils/sendEmail";
import {Like, MoreThan} from "typeorm";

const {deleteFile} = require("../utils/awsFunctions");

const UserRepo = AppDataSource.getRepository(User);
const FollowRepo = AppDataSource.getRepository(Follow);

class UserController {
    // signUp
    async signUpUser(req, res, next) {
        try {
            const {name, email, username, password} = req.body;
            const user = await UserRepo.findOne({
                where: [{email}, {username}],
            });
            if (user) {
                if (user.username === username) {
                    return next(createError(401, "User doesn't exist"));
                }
                return next(createError(401, "Email already exists"));
            }
            let hashPassword = await bcrypt.hash(password, 10);
            const newUser = await UserRepo.save({
                name: name,
                email: email,
                username: username,
                password: hashPassword,
            });
            await FollowRepo.save({
                following: {id: newUser.id},
                follower: {id: 12},
            });
            const accessToken = await Token.signAccessToken(newUser);
            res.status(200).json({
                message: "created successfully",
                newUser,
                accessToken,
            });
        } catch (error) {
            next(error);
        }
    }

    // login
    async loginUser(req, res, next) {
        try {
            const {account, password} = req.body;
            const user = await UserRepo.findOne({
                where: [{email: account}, {username: account}],
            });
            if (!user) {
                return next(createError(401, "User doesn't exist"));
            }
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (!isPasswordMatched) {
                return next(createError(401, "Password mismatch"));
            }
            const accessToken = await Token.signAccessToken(user);
            res.status(200).json({
                message: "login successfully",
                user,
                accessToken,
            });
        } catch (error) {
            next(error);
        }
    }

    //logOut
    async logOut(req, res, next) {
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });

            res.status(200).json({
                success: true,
                message: "Logged Out",
            });
        } catch (error) {
            next(error);
        }
    }

    // Update Password
    async UpdatePassword(req, res, next) {
        try {
            const {oldPassword, newPassword} = req.body;
            const user = await UserRepo.findOne({
                where: {id: req.user.data.id},
            });
            const isPasswordMatched = await bcrypt.compare(
                oldPassword,
                user.password
            );
            if (!isPasswordMatched) {
                return next(createError(401, "Mật khẩu cũ không đúng"));
            }
            user.password = await bcrypt.hash(newPassword, 10);
            await UserRepo.save(user);
            res.status(200).json({
                success: true,
                message: "Change password successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    // Follow | Unfollow User
    async followUser(req, res, next) {
        try {
            const userToFollow = await UserRepo.findOne({
                where: {id: req.params.id},
            });
            if (!userToFollow) {
                return next(createError(401, "User Not Found"));
            }
            const follow = await FollowRepo.findOne({
                relations: {
                    following: true,
                    follower: true,
                },
                where: {
                    following: {id: req.user.data.id},
                    follower: {id: req.params.id},
                },
            });
            if (follow) {
                FollowRepo.delete({
                    following: {id: req.user.data.id},
                    follower: {id: req.params.id},
                });
                res.status(200).json({
                    success: true,
                    message: "Delete Follow",
                });
            } else {
                FollowRepo.save({
                    following: {id: req.user.data.id},
                    follower: {id: req.params.id},
                });
                res.status(200).json({
                    success: true,
                    message: "create Follow ",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // AccountDetails
    async getAccountDetails(req, res, next) {
        try {
            const user = await UserRepo.findOne({
                relations: {
                    posts: true,
                    followers: true,
                },
                where: {posts: {id: req.params.id}, id: req.user.data.id},
            });
            res.json({user: user});
        } catch (error) {
            next(error);
        }
    }

    // updateProfile
    async updateProfile(req, res, next) {
        try {
            const {name, username, email} = req.body;
            const user = await UserRepo.findOneBy({id: req.user.data.id});
            const userExists = await UserRepo.createQueryBuilder("user")
                .where("user.email = :email OR user.username = :username", {
                    email,
                    username,
                })
                .getOne();
            if (
                userExists &&
                userExists.id.toString() !== req.user.data.id.toString()
            ) {
                return next(createError(404, "User Already Exists"));
            }
            if (req.body.avatar !== "") {
                await deleteFile(user.profile_picture);
                user.profile_picture = req.file.location;
            }
            user.username = username;
            user.name = name;
            user.email = email;
            await UserRepo.save(user);
            res.status(200).json({
                user: user,
                success: true,
                message: "Update profile successfully",
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    // Forgot Password
    async forgotPassword(req, res, next) {
        try {
            const user = await UserRepo.findOneBy({email: req.body.email});
            if (!user) {
                return next(createError(404, "User Not Found"));
            }
            const resetToken = crypto.randomBytes(20).toString("hex");
            let resetPasswordToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            user.resetPasswordToken = resetPasswordToken;
            user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
            UserRepo.save(user);
            const resetPasswordUrl = `http://localhost:3000/password/reset/${resetPasswordToken}`;
            try {
                await sendEmail({
                    email: user.email,
                    data: {
                        reset_url: resetPasswordUrl,
                    },
                });
                res.status(200).json({
                    success: true,
                    message: `Email sent to ${user.email}`,
                });
            } catch (error) {
                next(error);
            }
        } catch (error) {
            next(error);
        }
    }

    // Reset Password
    async resetPassword(req, res, next) {
        try {
            const resetPasswordToken = crypto
                .createHash("sha256")
                .update(req.params.token)
                .digest("hex");
            const user = await UserRepo.findOneBy({
                resetPasswordToken: req.params.token,
                resetPasswordExpiry: MoreThan(new Date(Date.now())),
            });
            if (!user) {
                createError(404, "User Not Found");
            }
            let password = req.body.password;
            let hashPassword = await bcrypt.hash(password, 10);
            user.password = hashPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpiry = null;

            await UserRepo.save(user);
            const accessToken = await Token.signAccessToken({id: user.id});
            res.cookie("token", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });
            res.status(200).json({
                success: true,
                message: `oke`,
            });
        } catch (error) {
            next(error);
        }
    }

    // User Search
    async searchUsers(req, res, next) {
        try {
            if (req.query.keyword) {
                const users = await UserRepo.find({
                    where: [
                        {name: Like(`%${req.query.keyword}%`)},
                        {username: Like(`%${req.query.keyword}%`)},
                    ],
                });
                res.status(200).json({
                    success: true,
                    users,
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // suggested Users
    async suggestedUsers(req, res, next) {
        try {
            const users = await UserRepo.find({
                relations: {
                    followers: true,
                },
            });
            const suggestedUsers = users
                .filter(
                    (u) =>
                        !u.followers.includes(req.user.data.id) &&
                        u.id.toString() !== req.user.data.id.toString()
                )
                .slice(-5);
            res.status(200).json({
                success: true,
                users: suggestedUsers,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserDetail(req, res, next) {
        try {
            const username = req.params.username;
            const user = await UserRepo.createQueryBuilder("user")
                .leftJoinAndSelect("user.followers", "follower")
                .leftJoinAndSelect("follower.following", "followerUser")
                .leftJoinAndSelect("user.following", "following")
                .leftJoinAndSelect("following.follower", "followingUser")
                .leftJoinAndSelect("user.posts", "post")
                .leftJoinAndSelect("post.comments", "comment")
                .leftJoinAndSelect("comment.user", "commentUser")
                .leftJoinAndSelect("post.likes", "like")
                .leftJoinAndSelect("like.user", "likeUser")
                .leftJoinAndSelect("post.postedBy", "postUser")
                .where("user.username = :username", {username})
                .getOne();
            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get User Details
    async getUserDetailsById(req, res, next) {
        try {
            const user = await UserRepo.findOne({
                where: {id: req.params.id},
            });
            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
