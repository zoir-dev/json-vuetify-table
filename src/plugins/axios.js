"use strict";

import axios from "axios";

let config = {
  baseURL: process.env.VUE_APP_BASE_URL || process.env.apiUrl || "",
};

const instance = axios.create(config);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default instance;
