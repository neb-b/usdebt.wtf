import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import Head from "next/head"

import Layout from "components/Layout"
import theme from "theme"

function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => setIsMounted(true), [])

  return (
    <>
      <Head>
        <title>usdebt.wtf</title>
        <meta name="og:image" content="https://usdebt.wtf/31.png" />
        <link rel="icon" type="image/x-icon" href="https://usdebt.wtf/favicon.png"></link>
        <meta property="og:description" content="wtf is going on with the us debt?" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://usdebt.wtf/og.png" />
        <meta name="twitter:title" content="usdebt.wtf" />
      </Head>
      <ChakraProvider theme={theme}>
        <Layout>{isMounted && <Component {...pageProps} />}</Layout>
      </ChakraProvider>
    </>
  )
}

export default App
