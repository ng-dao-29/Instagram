import express from "express";

const {uploadPost} = require("../utils/awsFunctions");
import Posts from "../controllers/post.controller";
import Token from "../middlewares/jwt.middleware";

const app = express();
app.use(Token.veryfyAccessToken);
export const Post = express.Router();

Post.post("/post/new", uploadPost.single("post"), Posts.newPost);

Post.get("/post/:id", Posts.likeUnlikePost)
    .delete("/post/:id", Posts.deletePost)
    .put("/post/:id", Posts.updateCaption);

Post.post("/post/comment/:id", Posts.newComment)
    .delete("/post/comment/:id", Posts.DeleteComment)
    .put("/post/comment/:id", Posts.updateComment);

Post.get("/posts", Posts.followersPosts);

Post.get("/posts/all", Posts.allPosts);

Post.get("/post/detail/:id", Posts.getPostDetails);