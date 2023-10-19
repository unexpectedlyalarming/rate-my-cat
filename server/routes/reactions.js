//Reactions are basically just likes. Routes for reactions
const router = require("express").Router();
const Reaction = require("../models/Reaction");
const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");

//Get reactions by postId

router.get("/post/:postId", async (req, res, next) => {
  try {
    const reactions = await Reaction.find({ postId: req.params.postId });
    res.status(200).json(reactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get reactions by catId (fetch from postId)

router.get("/cat/:catId", async (req, res, next) => {
  try {
    const reactions = Reaction.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $match: {
          "post.catId": mongoose.Types.ObjectId(req.params.catId),
        },
      },
    ]);
    res.status(200).json(reactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get reactions by userId

router.get("/user/:userId", async (req, res, next) => {
  try {
    const reactions = await Reaction.find({ userId: req.params.userId });
    res.json(reactions);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create a reaction

router.post("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.body.postId;
    const reactionExists = await Reaction.findOne({ userId, postId });
    if (reactionExists) {
      res.status(400).json({ message: "Reaction already exists" });
      return;
    }
    const reaction = await Reaction.create({ userId, postId });

    res.status(200).json(reaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete a reaction

router.delete("/:postId", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const reaction = await Reaction.findOne({ userId, postId });

    if (reaction) {
      await Reaction.findByIdAndDelete(reaction._id);
      res.status(200).json({ message: "Reaction deleted" });
    } else {
      res.status(400).json({
        message:
          "You are not authorized to delete this reaction or it does not exist",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Check if reaction exists

router.get("/check/:postId", async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const reactionExists = await Reaction.findOne({ userId, postId });
    if (reactionExists) {
      res.status(200).json("true");
    } else {
      res.status(400).json("false");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
