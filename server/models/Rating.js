//Rating Schema. Includes information like rating, comment, and a reference to the userId and postId.

const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 10 },
  comment: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  date: { type: Date, default: Date.now, required: true },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
