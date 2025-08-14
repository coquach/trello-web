import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatter";

const authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 20

authorizedAxiosInstance.defaults.withCredentials = true


// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(function (config) {
  interceptorLoadingElements(true)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
}
);

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(function onFulfilled(response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  interceptorLoadingElements(false)

  return response;
}, function onRejected(error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  interceptorLoadingElements(false)

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error);
});


export default authorizedAxiosInstance