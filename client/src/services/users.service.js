// Service to fetch users and information about them from the database

import axios from "axios";
import SERVER_URL from "../vars/vars";

class Users {
  constructor() {
    this.user = null;
  }

  //Get all users
  getAllUsers() {
    return axios
      .get(SERVER_URL + "/users", { withCredentials: true })
      .then((response) => {
        this.user = response.data;
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get one user by ID
  getUserById(userId) {
    return axios
      .get(SERVER_URL + "/users/" + userId, { withCredentials: true })
      .then((response) => {
        this.user = response.data;
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get profile by ID
  getProfileById(userId) {
    return axios
      .get(SERVER_URL + "/users/profile/" + userId, { withCredentials: true })
      .then((response) => {
        this.user = response.data;
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Update profile image
  updateProfilePicture(image) {
    console.log(image);
    return axios
      .patch(
        SERVER_URL + "/users/profile/image",
        { image },

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
  updateProfileBio(bio) {
    return axios
      .patch(
        SERVER_URL + "/users/profile/bio/",
        {
          bio,
        },
        { withCredentials: true }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  //Delete user by ID

  deleteUser(userId) {
    return axios
      .delete(SERVER_URL + "/users/" + userId, { withCredentials: true })
      .then((response) => {
        this.user = response.data;
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getCurrentUser() {
    return this.user;
  }
}

export default new Users();
