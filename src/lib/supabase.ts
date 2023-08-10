import { StorageClient } from '@supabase/storage-js';
import getConfig from 'next/config';

const { publicRuntimeConfig: config } = getConfig();

const STORAGE_URL = config.STORAGE_URL;
const SERVICE_KEY = config.STORAGE_KEY; //! service key, not anon key

export const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});
