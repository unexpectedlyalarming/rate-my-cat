//Service for handling authentication
import axios from "axios";
import SERVER_URL from "../vars/vars";

class Auth {
  constructor() {
    this.currentUser = null;
  }

  login(username, password) {
    return axios
      .post(
        SERVER_URL + "/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data) {
          this.currentUser = response.data.user;
        }
        return response.data;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  logout() {
    return axios
      .get(SERVER_URL + "/auth/logout", { withCredentials: true })
      .then(() => {
        this.currentUser = null;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }
  register(username, password) {
    return axios
      .post(
        SERVER_URL + "/auth/register",
        {
          username,
          password,
        },
        { withCredentials: true }
      )
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }
  validateSession() {
    return axios
      .get(SERVER_URL + "/auth/validate-session", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else return null;
      })
      .catch((err) => {
        return new Error(err.response.data.message);
      });
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export default new Auth();
