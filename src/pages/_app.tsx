import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import Head from "next/head"

import theme from "theme"

function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => setIsMounted(true), [])

  return (
    <>
      <Head>
        <title>usdebt.wtf</title>
        <meta name="og:title" content="usdebt.wtf" />
        <meta name="og:image" content="https://usdebt.wtf/api/og" />
        <link rel="icon" type="image/x-icon" href="https://usdebt.wtf/favicon.png"></link>
        <meta property="og:description" content="wtf is going on with the us debt?" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://usdebt.wtf/api/og" />
        <meta name="twitter:title" content="usdebt.wtf" />
      </Head>
      <ChakraProvider theme={theme}>{isMounted && <Component {...pageProps} />}</ChakraProvider>
    </>
  )
}

export default App
