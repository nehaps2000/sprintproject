import axios from "axios";
let baseUrl = "http://192.168.20.124";

const api =  (method, url,body) => {
  let newUrl = baseUrl + url;
  if (method === "get") {
    // const response =  axios.get(newUrl).promise.then((response)=>{
    // return response.data;
    // });
    // return new Promise((resolve, reject) => {
    //   const response = axios.get(newUrl);
    //   //console.log(response);
    //   resolve(response);
    // })
    return axios.get(newUrl).then((response) => {
      return response.data;
    } );
  } else if (method === "post") {
    return axios.post(newUrl,body).then((response) => {
      return response;
    }
    ).catch((error)=>{
console.log(error)
    })

  }
  else if (method === "delete") {
    return axios.delete(newUrl).then((response) => {
      return response;
    }
    ).catch((error)=>{
console.log(error)
    })

  }

  else if (method === "patch") {
    return axios.patch(newUrl).then((response) => {
      return response;
    }
    ).catch((error)=>{
console.log(error)
    })

  } 


};

export default api;
