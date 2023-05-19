import axios from "axios";
// import { getTokens } from "~/utils/getTokens";
import { getTokens } from "../utils/getTokens";
const BASE_URL =
  process.env.BASE_URL || "https://codevalidation-api.onrender.com/api";
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
const getParsedUrl = (url, params) => {
  if (!params) {
    return url;
  }
  let urlString = "";
  Object.keys(params).forEach((key, index, array) => {
    if (params[key] !== undefined && params[key] !== null) {
      urlString += `${index === 0 ? "?" : ""}${key}=${params[key]}${
        index !== array.length - 1 ? "&" : ""
      }`;
    }
  });

  return url + urlString;
};

// axios interceptors for adding authorization in axios instance
instance.interceptors.request.use(
  (config) => {
    const token = getTokens();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add other HTTP methods as needed
const API = {
  get: (url, params) => instance.get(getParsedUrl(url, params)),
  post: (url, params) => instance.post(url, params),
  put: (url, params) => instance.put(url, params),
  patch: (url, params) => instance.patch(url, params),
  delete: (url, params) => instance.delete(getParsedUrl(url, params)),
  head: (url, params) => instance.head(getParsedUrl(url, params)),
  options: (url, params) => instance.options(getParsedUrl(url, params)),
};
export default API;
