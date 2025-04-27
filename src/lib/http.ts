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

    // Remove Content-Type header for FormData to let browser set it with boundary
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  });

  return instance;
};

// Default instance with JSON content type
export const httpClient = createHttpClient();

// Instance for form data
export const httpFormClient = createHttpClient({
  defaultContentType: ContentType.FORM_DATA,
});

// You can create more specialized instances as needed
export const apiClient = {
  json: httpClient,
  form: httpFormClient,
  
  // Alternatively create new instances with different configs
  custom: (options: HttpClientOptions) => createHttpClient(options),
};