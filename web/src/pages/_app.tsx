import { ClerkProvider } from '@clerk/nextjs';
import { MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';

import '@/styles/globals.css';

import { client, queryClient, rspc } from '@/lib/rspc';

import { persistor, wrapper } from '@/redux';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
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
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />
          </PersistGate>
        </MantineProvider>
      </ClerkProvider>
    </rspc.Provider>
  );
}

export default wrapper.withRedux(MyApp);
