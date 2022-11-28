import axios from "axios";
let baseUrl = "http://192.168.20.124";

const api = async (method, url, body) => {
  let newUrl = baseUrl + url;
  if (method === "get") {
    const response = await axios.get(newUrl);
    return response.data;
  } else if (method === "post") {
    const response = await axios.post(newUrl,body);
    return response.data;
  }else if (method === "delete") {
    const response = await axios.delete(newUrl);
    return response.data;
  }
};

export default api;
