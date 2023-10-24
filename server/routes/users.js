//Profiles are for a user
const express = require("express");
const router = express.Router();
const Cat = require("../models/Cat");
const User = require("../models/User");
const verifyToken = require("./auth");
const Rating = require("../models/Rating");
const Post = require("../models/Post");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
//Get all users

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one user by userId

router.get("/:userId", async (req, res) => {
  try {
    const users = await User.findById(req.params.userId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get user profile (Fetch user, and all cats, posts, and ratings associated with user)

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const cats = await Cat.find({ userId: req.params.userId });
    const ratings = await Rating.find({ userId: req.params.userId });

    //Fetch posts by catId (all posts are associated with a cat), then populate the reactions array of each
    const posts = await Post.aggregate([
      { $match: { catId: { $in: cats.map((cat) => cat._id) } } },
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
          _id: 1,
          catId: 1,
          title: 1,
          date: 1,
          image: 1,
          reactions: "$reactions",
        },
      },
    ]);

    res.status(200).json({ user, cats, ratings, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update user profile image

router.patch("/profile/image", upload.single("image"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    //Check for profile picture
    if (req.file) {
      const imageUrl = `https://api.cats.elynch.co/images/${
        req.file.filename
      }`;
      user.image = imageUrl;
    }
    await user.save();
    res.status(200).json(user.image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update user profile bio

router.patch("/profile/bio", async (req, res) => {
  try {
    const users = await User.findById(req.user.id);
    if (req.body.bio.length > 300) {
      return res.status(400).json({ message: "Bio cannot be over 00 chars" });
    }
    if (req.body.bio) users.bio = req.body.bio;

    await users.save();
    res.status(200).json(users.bio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//TODO: Update password or add email
module.exports = router;
