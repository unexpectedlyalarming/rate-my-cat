// Service to fetch cats and information about them from the database

import axios from "axios";
import SERVER_URL from "../vars/vars";

class Cats {
  constructor() {
    this.cat = null;
  }
  //Get all cats
  getAllCats() {
    return axios
      .get(SERVER_URL + "/cats", { withCredentials: true })
      .then((response) => {
        this.cat = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get all cats by userId

  getAllCatsByUserId(userId) {
    return axios
      .get(SERVER_URL + "/cats/user/" + userId, { withCredentials: true })
      .then((response) => {
        this.cat = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Get one cat by catId

  getCatById(catId) {
    return axios
      .get(SERVER_URL + "/cats/" + catId, { withCredentials: true })
      .then((response) => {
        this.cat = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Create new cat

  createCat(cat) {
    return axios
      .post(SERVER_URL + "/cats", cat, { withCredentials: true })
      .then((response) => {
        this.cat = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Update cat

  updateCat(catId, cat) {
    return axios
      .patch(SERVER_URL + "/cats/" + catId, cat, { withCredentials: true })
      .then((response) => {
        this.cat = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //Delete cat

  deleteCat(catId) {
    return axios
      .delete(SERVER_URL + "/cats/" + catId, { withCredentials: true })
      .catch((err) => {
        console.error(err);
      });
  }

  //Fetch this.cat

  getCat() {
    return this.cat;
  }
}

export default new Cats();
