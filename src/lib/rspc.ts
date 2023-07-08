import { createClient, FetchTransport, RSPCError } from '@rspc/client';
import { createReactQueryHooks } from '@rspc/react';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import getConfig from 'next/config';
import { toast } from 'react-toastify';

import { Procedures } from '@/utils/api';

const rspc = createReactQueryHooks<Procedures>();

const { publicRuntimeConfig: config } = getConfig();

// You must provide the generated types as a generic and create a transport (in this example we are using HTTP Fetch) so that the client knows how to communicate with your API.
const client = createClient<Procedures>({
  // Refer to the integration your using for the correct transport.
  transport: new FetchTransport(
    `${
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:9000'
        : `${config.BACKEND_URL}`
    }/rspc`
  ),
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof RSPCError) toast.error(err.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if (err instanceof RSPCError) toast.error(err.message);
    },
    onSuccess: (_data, _variables, _context, mutation) => {
      toast.success(mutation?.meta?.message as string);
    },
  }),
});

export { client, queryClient, rspc };
