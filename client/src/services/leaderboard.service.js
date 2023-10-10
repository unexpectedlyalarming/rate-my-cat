//Service to fetch leaderboard information from the database

import axios from "axios";
import SERVER_URL from "../vars/vars";

class Leaderboards {
  constructor() {
    this.leaderboard = null;
  }
  //Takes day, month, or all as a parameter
  getLeaderboard(timeframe) {
    return axios
      .get(SERVER_URL + "/leaderboard/cats/" + timeframe, {
        withCredentials: true,
      })
      .then((response) => {
        this.leaderboard = response.data;
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }
  getFullLeaderboard() {
    //This function fetches the leaderboard 3 times, with day, month, and all, then puts them in an object
    const leaderboard = {};

    return axios
      .get(SERVER_URL + "/leaderboard/cats/day", { withCredentials: true })
      .then((response) => {
        leaderboard.day = response.data;
        return axios.get(SERVER_URL + "/leaderboard/cats/month", {
          withCredentials: true,
        });
      })
      .then((response) => {
        leaderboard.month = response.data;
        return axios.get(SERVER_URL + "/leaderboard/cats/all", {
          withCredentials: true,
        });
      })
      .then((response) => {
        leaderboard.all = response.data;
        this.leaderboard = leaderboard;
        return leaderboard;
      })
      .catch((err) => {
        console.error(err);
      });
  }
  getData() {
    return this.leaderboard;
  }
}

export default new Leaderboards();
