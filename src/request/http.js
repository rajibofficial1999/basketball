import axios from "axios";

const http = axios.create({
  // Set the api key
  headers: {
    "x-rapidapi-key": "402c30788077cc8e8988712918aaf638",
  },
});

export default http;
