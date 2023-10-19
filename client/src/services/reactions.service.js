import axios from "axios";
import SERVER_URL from "../vars/vars";

class Reactions {
  //Get all reactions by postId

  getAllReactionsByPostId(postId) {
    return axios
      .get(`${SERVER_URL}/reactions/post/${postId}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return new Error(err);
      });
  }
  //Get all reactions by userId

  getAllReactionsByUserId(userId) {
    return axios
      .get(`${SERVER_URL}/reactions/user/${userId}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return new Error(err);
      });
  }
  //Get all reactions by catId

  getAllReactionsByCatId(catId) {
    return axios
      .get(`${SERVER_URL}/reactions/cat/${catId}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return new Error(err);
      });
  }
  //Create a reaction
  createReaction(postId) {
    return axios
      .post(`${SERVER_URL}/reactions`, postId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return new Error(err);
      });
  }

  //Delete a reaction
  deleteReaction(reactionId) {
    return axios
      .delete(`${SERVER_URL}/reactions/${reactionId}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return new Error(err);
      });
  }
}

export default new Reactions();
