//Post schema. Includes information like title, userId and image.

const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  catId: { type: mongoose.Schema.Types.ObjectId, ref: "Cat" },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
