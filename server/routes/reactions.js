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
    const userId = req.body.userId;
    const postId = req.body.postId;

    const reaction = await Reaction.create({ userId, postId });

    res.status(200).json(reaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete a reaction

router.delete("/:reactionId", async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const reactionId = req.params.reactionId;

    const reaction = await Reaction.findById(reactionId);

    if (userId === reaction.userId) {
      await reaction.remove();
      res.status(200).json({ message: "Reaction deleted" });
    } else {
      res
        .status(400)
        .json({ message: "You are not authorized to delete this reaction" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
