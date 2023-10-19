//Reactions for posts, linked to a post and user. Reactions can be any emoji.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
