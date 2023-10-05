//Review Schema. Includes information like rating, comment, and a reference to the userId and postId.

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  date: { type: Date, default: Date.now, required: true },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
