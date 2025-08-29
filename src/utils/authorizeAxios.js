import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatter";
import { logoutUserAPI } from "~/redux/user/userSlice";
import { refreshTokenAPI } from "~/apis";
import { useNavigate } from "react-router-dom";


let axiosInjectStore
export const injectStore = mainStore => {
  axiosInjectStore = mainStore
}

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

let refreshTokenPromise = null


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

  if (error.response?.status === 401) {
    axiosInjectStore.dispatch(logoutUserAPI(false))
  }

  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {

    originalRequests._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => data?.accessToken)
        .catch((_error) => {
          axiosInjectStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => axios(originalRequests))
  }

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