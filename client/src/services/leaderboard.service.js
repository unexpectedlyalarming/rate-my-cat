//Service to fetch leaderboard information from the database

import axios from "axios";
import SERVER_URL from "../vars/vars";

class Leaderboard {
  constructor() {
    this.leaderboard = null;
  }
  //Takes day, month, or all as a parameter
  getLeaderboard(timeframe) {
    return axios
      .get(SERVER_URL + "/leaderboard/" + timeframe, { withCredentials: true })
      .then((response) => {
        this.leaderboard = response.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }
  getData() {
    return this.leaderboard;
  }
}

export default new Leaderboard();
