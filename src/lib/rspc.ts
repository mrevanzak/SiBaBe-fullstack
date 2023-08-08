import { createClient, FetchTransport, RSPCError } from '@rspc/client';
import { createReactQueryHooks } from '@rspc/react';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import getConfig from 'next/config';
import { toast } from 'react-toastify';

import { useJwtStore } from '@/lib/store';

import { Procedures } from '@/utils/api';

const rspc = createReactQueryHooks<Procedures>();

const { publicRuntimeConfig: config } = getConfig();

const BACKEND_URL = `${
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9000'
    : `${config.BACKEND_URL}`
}/rspc`;

const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = useJwtStore.getState().jwt;
  const resp = await globalThis.fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...init?.headers,
      authorization: `Bearer ${token}`,
    },
  });
  return resp;
};

// You must provide the generated types as a generic and create a transport (in this example we are using HTTP Fetch) so that the client knows how to communicate with your API.
const client = createClient<Procedures>({
  // Refer to the integration your using for the correct transport.
  transport: new FetchTransport(BACKEND_URL, fetch),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof RSPCError) return toast.error(err.message);
      toast.error('Something went wrong, please try again later.');
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err instanceof RSPCError) return toast.error(err.message);
      toast.error('Something went wrong, please try again later.');
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      toast.success(mutation?.meta?.message as string);
    },
  }),
});

export { client, queryClient, rspc };
