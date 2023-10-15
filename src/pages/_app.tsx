import { ClerkProvider } from '@clerk/nextjs';
import { MantineProvider } from '@mantine/core';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { client, queryClient, rspc } from '@/lib/rspc';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      <ClerkProvider {...pageProps}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
          }}
        >
          <Component {...pageProps} />
          <ToastContainer position='top-center' />
          <Analytics />
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ClerkProvider>
    </rspc.Provider>
  );
}
