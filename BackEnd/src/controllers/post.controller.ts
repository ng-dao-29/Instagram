import {Comment} from "../model/Comment";
import {Follow} from "../model/Follow";
import {User} from "../model/User";
import {Post} from "../model/Post";
import {Like} from "../model/Like";
import createError from "http-errors";
import {AppDataSource} from "../config/data-source";

const {deleteFile} = require("../utils/awsFunctions");
const PostRepo = AppDataSource.getRepository(Post);
const UserRepo = AppDataSource.getRepository(User);
const LikeRepo = AppDataSource.getRepository(Like);
const CommentRepo = AppDataSource.getRepository(Comment);
const FollowRepo = AppDataSource.getRepository(Follow);

class PostController {
    // add posts
    async newPost(req, res, next) {
        try {
            const postData = {
                content: req.body.content,
                image_url: req.file.location,
                postedBy: req.user.data.id,
            };
            const post = await PostRepo.save(postData);
            res.status(201).json({
                success: true,
                post,
            });
        } catch (error) {
            next(error);
        }
    }

    // delete post
    async deletePost(req, res, next) {
        try {
            const post = await PostRepo.findOne({
                where: {id: req.params.id},
                relations: {
                    postedBy: true,
                },
            });
            if (!post) {
                return next(createError(401, "Post Not Found"));
            }
            if (post.postedBy.id !== req.user.data.id) {
                return next(createError(401, "User Not Authenticated"));
            }
            await deleteFile(post.image_url);
            await PostRepo.delete({id: req.params.id});
            res.status(200).json({
                success: true,
                message: "Post Deleted",
            });
        } catch (error) {
            next(error);
        }
    }

    // update caption
    async updateCaption(req, res, next) {
        try {
            const post = await PostRepo.findOne({
                where: {id: req.params.id},
                relations: {
                    postedBy: true,
                },
            });
            if (!post) {
                return next(createError(401, "Post Not Found"));
            }
            if (post.postedBy.id !== req.user.data.id) {
                return next(createError(401, "User Not Authenticated"));
            }
            post.content = req.body.content;
            await PostRepo.save(post);
            res.status(200).json({
                success: true,
                message: "Post Updated",
            });
        } catch (error) {
            next(error);
        }
    }

    // Like or Unlike Post
    async likeUnlikePost(req, res, next) {
        try {
            const post = await PostRepo.findOne({
                where: {id: req.params.id},
                relations: {
                    postedBy: true,
                    likes: true,
                },
            });
            if (!post) {
                return next(createError(401, "Post Not Found"));
            }
            const like = await LikeRepo.findOne({
                relations: {
                    user: true,
                    post: true,
                },
                where: {post: {id: req.params.id}, user: {id: req.user.data.id}},
            });
            if (like) {
                await LikeRepo.delete({
                    post: req.params.id,
                    user: req.user.data.id,
                });
                res.status(200).json({
                    success: true,
                    message: "Delete Like",
                });
            } else {
                await LikeRepo.save({
                    post: {id: req.params.id},
                    user: {id: req.user.data.id},
                });
                res.status(200).json({
                    success: true,
                    message: "Create Like ",
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // Add Comment
    async newComment(req, res, next) {
        try {
            const post = await PostRepo.findOne({
                where: {id: req.params.id},
            });
            if (!post) {
                return next(createError(401, "Post Not Found"));
            }
            const comment = await CommentRepo.save({
                user: req.user.data.id,
                comment_text: req.body.comment,
                post: req.params.id,
            });
            res.status(201).json({
                success: true,
                comment,
            });
        } catch (error) {
            next(error);
        }
    }

    //delete comment
    async DeleteComment(req, res, next) {
        try {
            const comment = await CommentRepo.findOne({
                where: {id: req.params.id},
                relations: {
                    user: true,
                },
            });
            if (!comment) {
                return next(createError(404, "Post Not Found"));
            }
            if (comment.user.id !== req.user.data.id) {
                return next(createError(401, "User Not Authenticated"));
            }
            await CommentRepo.delete({id: req.params.id});
            res.status(200).json({
                success: true,
                message: "Comment Delete Success",
            });
        } catch (error) {
            next(error);
        }
    }

    // update comment
    async updateComment(req, res, next) {
        try {
            const comment = await CommentRepo.findOne({
                where: {id: req.params.id},
                relations: {
                    user: true,
                },
            });
            if (!comment) {
                return next(createError(401, "comment Not Found"));
            }
            if (comment.user.id !== req.user.data.id) {
                return next(createError(401, "User Not Authenticated"));
            }
            comment.comment_text = req.body.comment;
            await CommentRepo.save(comment);
            res.status(200).json({
                success: true,
                message: "Comment Updated",
            });
        } catch (error) {
            next(error);
        }
    }

    // show followers posts
    async followersPosts(req, res, next) {
        try {
            const currentPage = Number(req.query.page) || 1;
            const skipPosts = 4 * (currentPage - 1);
            const users = await FollowRepo.createQueryBuilder("follow")
                .leftJoinAndSelect("follow.following", "user AS u")
                .leftJoinAndSelect("follow.follower", "u")
                .where("follow.following = :id", {id: req.user.data.id})
                .getMany();
            let arr = [];
            if (!users) return next(createError(404, "User Not Found"));
            else if (!users.length) {
                return res.status(200).json({
                    success: true,
                    posts: [],
                });
            }
            users.forEach((user) => arr.push(user.follower));

            const posts = await PostRepo.createQueryBuilder("post")
                .leftJoinAndSelect("post.postedBy", "user")
                .leftJoinAndSelect("post.comments", "comments")
                .leftJoinAndSelect("comments.user", "commentUser")
                .leftJoinAndSelect("post.likes", "likes")
                .leftJoinAndSelect("likes.user", "likeUser")
                .where(`user.id IN (${arr.map((user) => user.id).join(", ")})`)
                .orWhere("user.id = :id", {id: req.user.data.id})
                .orderBy("post.created_at", "DESC")
                .skip(skipPosts)
                .take(4)
                .getMany();
            if (!posts) return next(createError(404, "Post Not Found"));

            const totalPost = await PostRepo.find({
                where: {
                    postedBy: arr,
                },
            });
            let totalPosts = totalPost.length;

            return res.status(200).json({
                success: true,
                posts: posts,
                totalPosts,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get All Posts
    async allPosts(req, res, next) {
        try {
            const posts = await PostRepo.find();
            return res.status(200).json({
                posts,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get Post Details
    async getPostDetails(req, res, next) {
        try {
            const post = await PostRepo.createQueryBuilder("post")
                .leftJoinAndSelect("post.postedBy", "user")
                .leftJoinAndSelect("post.comments", "comments")
                .leftJoinAndSelect("comments.user", "commentUser")
                .leftJoinAndSelect("post.likes", "likes")
                .leftJoinAndSelect("likes.user", "likeUser")
                .where("post.id = :id", {id: req.params.id})
                .getOne();
            if (!post) {
                return next(createError(404, "Post Not Found"));
            }
            res.status(200).json({
                success: true,
                post,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new PostController();
