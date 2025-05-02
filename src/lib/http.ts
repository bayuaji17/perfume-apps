import Cookies from "js-cookie";
import axios, { AxiosInstance } from "axios";

export enum ContentType {
  JSON = "application/json",
  FORM_DATA = "multipart/form-data",
}

interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  defaultContentType?: ContentType;
  authTokenName?: string;
}

const createHttpClient = (options: HttpClientOptions = {}): AxiosInstance => {
  const {
    baseURL = "http://localhost:3000/api",
    timeout = 30000,
    defaultContentType = ContentType.JSON,
    authTokenName = "authjs.session-token",
  } = options;

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      Accept: ContentType.JSON,
      "Content-Type": defaultContentType,
    },
  });

  instance.interceptors.request.use((config) => {
    const token = Cookies.get(authTokenName);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  });

  return instance;
};


export const httpClient = createHttpClient();


export const httpFormClient = createHttpClient({
  defaultContentType: ContentType.FORM_DATA,
});


export const apiClient = {
  json: httpClient,
  form: httpFormClient,
  
 
  custom: (options: HttpClientOptions) => createHttpClient(options),
};