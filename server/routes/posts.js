//All posts are associated with a cat
const express = require("express");
const router = express.Router();
const axios = require("axios");
const Post = require("../models/Post");
const Cat = require("../models/Cat");
const User = require("../models/User");

const mongoose = require("mongoose");
const multer = require("multer");

const postLimiter = require("../Utils/RateLimit").postLimiter;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "cats",
          localField: "catId",
          foreignField: "_id",
          as: "cat",
        },
      },
      {
        $unwind: "$cat",
      },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "postId",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "postId",
          as: "reactions",
        },
      },
      {
        $project: {
          catName: "$cat.name",
          userId: "$cat.userId",
          title: 1,
          image: 1,
          catId: 1,
          date: 1,
          ratings: "$ratings.rating",
          reactions: "$reactions",
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all posts, sort by most ratings

router.get("/ratings", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "cats",
          localField: "catId",
          foreignField: "_id",
          as: "cat",
        },
      },
      {
        $unwind: "$cat",
      },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "postId",
          as: "ratings",
        },
      },
      {
        $project: {
          catName: "$cat.name",
          title: 1,
          image: 1,
          catId: 1,
          date: 1,
          reactions: "$reactions",
          ratings: "$ratings.rating",
          numRatings: { $size: "$ratings" },
        },
      },
      {
        $sort: { numRatings: -1 },
      },
    ]);

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get top posts of day

router.get("/top/day", async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
          },
        },
      },

      {
        $lookup: {
          from: "cats",
          localField: "catId",
          foreignField: "_id",
          as: "cat",
        },

        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "postId",
          as: "reactions",
        },
      },

      {
        $project: {
          catName: "$cat.name",

          title: 1,
          image: 1,
          catId: 1,
          date: 1,
          reactions: "$reactions",
          ratings: 1,
        },
      },
      {
        $sort: { ratings: -1 },
      },
    ]);

    res.status(200).json(posts);
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
    const id = req.params.postId.toString();

    const postId = new mongoose.Types.ObjectId(id);

    //aggregate, return post and cat name as one object

    const post = await Post.aggregate([
      {
        $match: { _id: postId },
      },
      {
        $lookup: {
          from: "cats",
          localField: "catId",
          foreignField: "_id",
          as: "cat",
        },
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "postId",
          as: "reactions",
        },
      },
      {
        $project: {
          catName: "$cat.name",
          title: 1,
          image: 1,
          catId: 1,
          date: 1,
          reactions: "$reactions",
        },
      },
    ]);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create new post

router.post("/", postLimiter, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;
    // const userId = req.user.id;
    const catId = req.body.catId;

    //Check if catId is owned by userid
    const currentCat = await Cat.findById(catId);

    if (!currentCat || currentCat.userId.toString() !== userId) {
      return res.status(401).json({ message: "You do not own this cat" });
    }

    const title = req.body.title;
    if (title.length > 250) {
      return res.status(400).json({ message: "Title too long" });
    }
    let image;
    if (req.body.image) {
      image = req.body.image;
      //Fetch image url and check if it's valid
      const response = await axios.get(image);
      if (response.status !== 200) {
        return res.status(400).json({ message: "Invalid image url" });
      }
    }

    //If image is a file, put in local storage and store url
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
      console.log("Received image file");
    }

    const newPost = new Post({
      catId: catId,
      title: title,
      image: image,
    });
    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete post

router.delete("/:postId", async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    //Check if post exists
    const currentPost = await Post.findById(postId);
    if (!currentPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    //Check if post is owned by user
    const currentCat = await Cat.findById(currentPost.catId);

    if (!currentCat || currentCat.userId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //Delete post
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Edit post

router.patch("/:postId", postLimiter, async (req, res) => {
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
