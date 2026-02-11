import axios, { AxiosInstance } from 'axios';

export type ApiClient = AxiosInstance;

export function createApiClient(baseURL: string): ApiClient {
  return axios.create({
    baseURL,
    timeout: 30_000,
  });
}
