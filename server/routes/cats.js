//All profiles can create cats, which are essentially profiles for each cat that they post
const express = require("express");
const router = express.Router();
const cat = require("../models/Cat");
const user = require("../models/User");
const verifyToken = require("./auth");
const review = require("../models/Rating");
const post = require("../models/Post");

//Get all cats

router.get("/", async (req, res) => {
  try {
    const cats = await cat.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all cats by userId

router.get("/user/:userId", async (req, res) => {
  try {
    const cats = await cat.find({ userId: req.params.userId });
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get one cat by catId

router.get("/:catId", async (req, res) => {
  try {
    const cats = await cat.findById(req.params.catId);

    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Create new cat

router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const newCat = new cat({
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      bio: req.body.bio,
      image: req.body.image,
      userId: userId,
    });
    await newCat.save();
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
    const currentCat = await cat.findById(catId);
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
    const currentCat = await cat.findById(catId);
    if (currentCat.userId !== userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //Delete all reviews associated with cat
    const reviews = await review.find({ catId: catId });
    reviews.forEach(async (review) => {
      await review.delete();
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

module.exports = router;
