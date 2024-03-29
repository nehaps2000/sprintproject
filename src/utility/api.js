import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const token = localStorage.getItem("token");
const resId = localStorage.getItem("resId");
const headers = { headers: { authorization: `Bearer ${token}`, id: resId } };
let baseUrl = "http://192.168.20.124";

const api = async (method, url, body) => {
  let newUrl = baseUrl + url;

  if (method === "get") {
    const response = await axios.get(newUrl, headers);
    return response.data;
  } else if (method === "post") {
    try {
      const response = await axios.post(newUrl, body, headers);
      if (response.status === 200) {
        toast.success("Successful");
        return response.data;
      }
    } catch {
      toast.error("Failed ");
    }
  } else if (method === "delete") {
    try {
      const response = await axios.delete(newUrl, headers, body);
      if (response.status === 200) {
        toast.warning("Deleted");
        return response.data;
      }
    } catch {
      toast.error("Failed to delete");
    }
  } else if (method === "patch") {
    try {
      const response = await axios.patch(newUrl, body, headers);
      if (response.status === 200) {
        toast.success("Updated");
        return response.data;
      }
    } catch {
      toast.error("Failed to update");
    }
  }
};

export default api;
