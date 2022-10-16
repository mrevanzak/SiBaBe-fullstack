import { MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { wrapper } from '@/redux';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default wrapper.withRedux(MyApp);
