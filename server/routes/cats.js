//All profiles can create cats, which are essentially profiles for each cat that they post
const express = require("express");
const router = express.Router();
const Cat = require("../models/Cat");
const User = require("../models/User");
const verifyToken = require("./auth");
const Ratings = require("../models/Rating");
const post = require("../models/Post");
const jwt = require("jsonwebtoken");

//Get all cats by userId

router.get("/user/:userId", async (req, res) => {
  try {
    const cats = await Cat.find({ userId: req.params.userId });
    console.log("getting cats by userid");
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one cat by catId

router.get("/:catId", async (req, res) => {
  try {
    const cats = await Cat.findById(req.params.catId);
    //Find posts associated with cat
    const posts = await post.find({ catId: req.params.catId });
    //Find userId username
    const owner = await User.findById(cats.userId);
    const ownerUsername = owner.username;

    //Find ratings associated with cat
    const ratings = await Ratings.find({ catId: req.params.catId });

    const newCats = {
      name: cats.name,
      breed: cats.breed,
      age: cats.age,
      bio: cats.bio,
      image: cats.image,
      userId: cats.userId,
      owner: ownerUsername,
      ratings: ratings,

      posts: posts,
    };
    res.status(200).json(newCats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create new cat

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const newCat = new Cat({
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      image: req.body.image,
      userId: userId,
    });

    res.status(200).json(newCat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Update cat

router.patch("/:catId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const catId = req.params.catId;
    //Check if catId is owned by userid
    const currentCat = await Cat.findById(catId);
    if (currentCat.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    currentCat.name = req.body.name;
    currentCat.breed = req.body.breed;
    currentCat.age = req.body.age;
    currentCat.bio = req.body.bio;
    currentCat.image = req.body.image;
    await currentCat.save();
    res.status(200).json(currentCat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete cat

router.delete("/:catId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const catId = req.params.catId;
    //Check if catId is owned by userid
    const currentCat = await Cat.findById(catId);
    if (currentCat.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //Delete all ratings associated with cat
    const ratings = await Rating.find({ catId: catId });
    ratings.forEach(async (rating) => {
      await rating.delete();
    });

    //Delete all posts associated with cat
    const posts = await post.find({ catId: catId });
    posts.forEach(async (post) => {
      await post.delete();
    });
    //Delete cat
    await currentCat.delete();
    res.status(200).json({ message: "Cat deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all cats

router.get("/", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Follower subroutes

const followerRouter = require("./cats/followers");

router.use("/:catId/followers", followerRouter);

module.exports = router;
