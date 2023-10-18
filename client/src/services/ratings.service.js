//Service for fetching ratings and information about them from the database
import axios from "axios";
import SERVER_URL from "../vars/vars";

class Ratings {
  constructor() {
    this.ratings = null;
  }
  //Get all ratings
  getAllRatings() {
    return axios
      .get(SERVER_URL + "/ratings", { withCredentials: true })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Get ratings by postId

  getRatingsByPostId(postId) {
    return axios
      .get(SERVER_URL + "/ratings/post/" + postId, { withCredentials: true })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Get ratings by userId
  getRatingsByUserId(userId) {
    return axios
      .get(SERVER_URL + "/ratings/user/" + userId, { withCredentials: true })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Get ratings by catId

  getRatingsByCatId(catId) {
    return axios
      .get(SERVER_URL + "/ratings/cat/" + catId, { withCredentials: true })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Get rating by ratingId

  getRatingByRatingId(ratingId) {
    return axios
      .get(SERVER_URL + "/ratings/" + ratingId, { withCredentials: true })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Create rating

  createRating(rating) {
    return axios
      .post(SERVER_URL + "/ratings", rating, { withCredentials: true })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Delete rating

  deleteRating(ratingId) {
    return axios
      .delete(SERVER_URL + "/ratings/" + ratingId, { withCredentials: true })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Update rating

  updateRating(ratingId, rating) {
    return axios
      .patch(SERVER_URL + "/ratings/" + ratingId, rating, {
        withCredentials: true,
      })
      .then((response) => {
        this.ratings = response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Get average rating by catId

  getAverageRatingByCatId(catId) {
    return axios
      .get(SERVER_URL + "/ratings/cat/" + catId + "/average", {
        withCredentials: true,
      })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Get average rating by userId

  getAverageRatingByUserId(userId) {
    return axios
      .get(SERVER_URL + "/ratings/user/" + userId + "/average", {
        withCredentials: true,
      })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  //Get average rating by postId

  getAverageRatingByPostId(postId) {
    return axios
      .get(SERVER_URL + "/ratings/post/" + postId + "/average", {
        withCredentials: true,
      })
      .then((response) => {
        this.ratings = response.data;
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  getCurrentRating() {
    return this.ratings;
  }
}

export default new Ratings();
