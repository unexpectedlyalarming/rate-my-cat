//user schema. Includes information like username, password, profile picture, and reference to cats.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  bio: { type: String, required: false },
  date: { type: Date, default: Date.now, required: true },
  cats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cat" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
