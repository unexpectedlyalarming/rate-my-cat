//All posts are associated with a cat
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Cat = require("../models/Cat");
const User = require("../models/User");
const verifyToken = require("./auth");

//Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all posts by catId

router.get("/cat/:catId", async (req, res) => {
  try {
    const posts = await Post.find({ catId: req.params.catId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all posts by userId

router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one post by postId

router.get("/:postId", async (req, res) => {
  try {
    const posts = await Post.findById(req.params.postId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create new post

router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const catId = req.body.catId;
    //Check if catId is owned by userid
    const currentCat = await Cat.findById(catId);
    if (currentCat.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    const newPost = new Post({
      userId: userId,
      catId: catId,
      title: title,
      description: description,
      image: image,
    });
    const post = await newPost.save();
    //Add post to user's posts array
    const user = await User.findById(userId);
    user.posts.push(post._id);
    await user.save();
    //Add post to cat's posts array
    const cat = await Cat.findById(catId);
    cat.posts.push(post._id);
    await cat.save();
    res.status(200).json({ message: "Post created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete post

router.delete("/:postId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    //Check if post exists
    const currentPost = await Post.findById(postId);
    if (!currentPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    //Check if post is owned by user
    if (currentPost.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //Delete post
    await Post.findByIdAndDelete(postId);
    //Delete post from user's posts array
    const user = await User.findById(userId);
    user.posts = user.posts.filter((post) => post !== postId);
    await user.save();
    //Delete post from cat's posts array
    const cat = await Cat.findById(currentPost.catId);
    cat.posts = cat.posts.filter((post) => post !== postId);
    await cat.save();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Edit post

router.patch("/:postId", verifyToken, async (req, res) => {
  //Only allow updating title

  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const title = req.body.title;
    //Check if post exists
    const currentPost = await Post.findById(postId);
    if (!currentPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    //Check if post is owned by user
    if (currentPost.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //Update post

    currentPost.title = title;
    await currentPost.save();

    res.status(200).json({ message: "Post updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Reaction subroutes

const reactionRouter = require("./posts/reactions");

router.use("/:postId/reactions", reactionRouter);

module.exports = router;
