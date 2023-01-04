import axios from "axios";

const token = localStorage.getItem("token");
const headers = { headers: { "authorization": `Bearer ${token}` } };
let baseUrl = "http://192.168.20.124";

const api = async (method, url, body) => {
  console.log(headers);
  let newUrl = baseUrl + url;

  if (method === "get") {
    const response = await axios.get(newUrl, headers);
    return response.data;
  } else if (method === "post") {
    const response = await axios.post(newUrl, body, headers);
    return response.data;
  } else if (method === "delete") {
    const response = await axios.delete(newUrl, headers, body);
    return response.data;
  } else if (method === "patch") {
    const response = await axios.patch(newUrl, body, headers);
    return response.data;
  }
};

export default api;
