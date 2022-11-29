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
  }else if (method === "patch") {
    const response = await axios.patch(newUrl,body);
    return response.data;
  }
};

export default api;


// import axios from "axios";
// let baseUrl = "http://192.168.20.124";

// const api =  (method, url,body) => {
//   let newUrl = baseUrl + url;
//   if (method === "get") {
//     return axios.get(newUrl).then((response) => {
//       return response.data;
//     } );
//   } else if (method === "post") {
//     return axios.post(newUrl,body).then((response) => {
//       return response;
//     }
//     ).catch((error)=>{
// console.log(error)
//     })

//   }
//   else if (method === "delete") {
//     return axios.delete(newUrl).then((response) => {
//       return response;
//     }
//     ).catch((error)=>{
// console.log(error)
//     })

//   }

//   else if (method === "patch") {
//     return axios.patch(newUrl,body).then((response) => {
//       return response;
//     }
//     ).catch((error)=>{
// console.log(error)
//     })

//   } 


// };

// export default api;
