// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

import { ProductMock } from '@/data';

const { publicRuntimeConfig: config } = getConfig();

export const API_URL = config.BACKEND_URL;

export const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

export default function productsAPI(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(ProductMock);
}
