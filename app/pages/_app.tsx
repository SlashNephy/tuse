import { ColorSchemeProvider, MantineProvider } from '@mantine/core'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from 'react-query'

import { useMemorableColorScheme } from '../lib/useMemorableColorScheme'

import type { AppProps } from 'next/app'

const queryClient = new QueryClient()

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [colorScheme, toggleColorScheme] = useMemorableColorScheme()

  // noinspection HtmlRequiredTitleElement
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme,
            }}
          >
            <Component {...pageProps} />
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </>
  )
}

// noinspection JSUnusedGlobalSymbols
export default MyApp
