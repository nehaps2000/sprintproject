import axios from "axios";
let baseUrl = "http://192.168.20.124";

const api = async (method, url) => {
  let newUrl = baseUrl + url;
  if (method === "get") {
    const response = await axios.get(newUrl);
    return response.data;
  } else if (method === "post") {
    axios.post(newUrl).then((response) => {
      return response;
    });
  }
};

export default api;
