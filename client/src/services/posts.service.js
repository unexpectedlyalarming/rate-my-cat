//Service for fetching posts and information about them from the database
import axios from "axios";
import SERVER_URL from "../vars/vars";

class Posts {
  constructor() {
    this.post = null;
  }
  //Get all posts
  getAllPosts() {
    return axios
      .get(SERVER_URL + "/posts", { withCredentials: true })
      .then((response) => {
        this.post = response.data;
        return this.post;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get posts by most ratings

  getPostsByMostRatings() {
    return axios
      .get(SERVER_URL + "/posts/ratings", { withCredentials: true })
      .then((response) => {
        this.post = response.data;
        return this.post;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get top posts of day

  getTopPostsOfDay() {
    return axios
      .get(SERVER_URL + "/posts/top/day", { withCredentials: true })
      .then((response) => {
        this.post = response.data;
        return this.post;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get all posts by catId

  getAllPostsByCatId(catId) {
    return axios
      .get(SERVER_URL + "/posts/cat/" + catId, { withCredentials: true })
      .then((response) => {
        this.post = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get all posts by userId

  getAllPostsByUserId(userId) {
    return axios
      .get(SERVER_URL + "/posts/user/" + userId, { withCredentials: true })
      .then((response) => {
        this.post = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get one post by ID
  getPostById(postId) {
    return axios
      .get(SERVER_URL + "/posts/" + postId, { withCredentials: true })
      .then((response) => {
        this.post = response.data;
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Create new post

  createPost(title, image, catId) {
    return axios
      .post(
        SERVER_URL + "/posts",
        {
          title,
          image,
          catId,
        },

        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  //Edit post

  editPost(postId, title, description, image) {
    return axios
      .patch(
        SERVER_URL + "/posts/" + postId,
        {
          title,
          description,
          image,
        },
        { withCredentials: true }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  //Delete post

  deletePost(postId) {
    return axios
      .delete(SERVER_URL + "/posts/" + postId, { withCredentials: true })
      .catch((err) => {
        console.error(err);
      });
  }

  getPost() {
    return this.post;
  }
}

export default new Posts();
