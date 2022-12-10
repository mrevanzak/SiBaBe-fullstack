// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig: config } = getConfig();

export const API_URL = config.BACKEND_URL;
export const API_KEY = config.IMGBB_KEY;

export const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
