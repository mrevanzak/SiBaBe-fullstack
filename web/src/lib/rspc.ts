import { createClient, FetchTransport } from '@rspc/client';
import { createReactQueryHooks } from '@rspc/react';
import { QueryClient } from '@tanstack/react-query';

import { Procedures } from '@/utils/api';

const rspc = createReactQueryHooks<Procedures>();

// You must provide the generated types as a generic and create a transport (in this example we are using HTTP Fetch) so that the client knows how to communicate with your API.
const client = createClient<Procedures>({
  // Refer to the integration your using for the correct transport.
  transport: new FetchTransport('http://localhost:9000/rspc'),
});

const queryClient = new QueryClient();

export { client, queryClient, rspc };
