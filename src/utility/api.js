import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const token = localStorage.getItem("token");
const headers = { headers: { authorization: `Bearer ${token}` } };
let baseUrl = "http://192.168.20.124";

const api = async (method, url, body) => {
  console.log(headers);
  let newUrl = baseUrl + url;

  if (method === "get") {
    const response = await axios.get(newUrl, headers);
    return response.data;
  } else if (method === "post") {
    const response = await axios.post(newUrl, body, headers);
    if (response.status === 200) {
      toast.success("Successfull");
    }
    return response.data;
  } else if (method === "delete") {
    const response = await axios.delete(newUrl, headers, body);
    if (response.status === 200) {
      toast.warning("deleted");
    }

    return response.data;
  } else if (method === "patch") {
    const response = await axios.patch(newUrl, body, headers);
    if (response.status === 200) {
      toast.success(" updated");
    }
    return response.data;
  }
};

export default api;
