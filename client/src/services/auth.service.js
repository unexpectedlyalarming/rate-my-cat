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
        if (response.data.cookies.accessToken) {
          this.currentUser = response.data.user;
        }
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  logout() {
    return axios
      .get(SERVER_URL + "/auth/logout", { withCredentials: true })
      .then(() => {
        this.currentUser = null;
      })
      .catch((err) => {
        console.error(err);
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
        console.error(err);
      });
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

export default new Auth();
