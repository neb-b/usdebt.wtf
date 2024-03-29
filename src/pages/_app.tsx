import React from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import Head from "next/head"
import { Analytics } from "@vercel/analytics/react"

import theme from "theme"

function App({ Component, pageProps }: AppProps) {
  const ogImage = `https://usdebt.wtf/api/og?reset=${Date.now()}`

  return (
    <>
      <Head>
        <title>usdebt.wtf</title>
        <meta name="og:title" content="usdebt.wtf" />
        <meta name="og:image" content={ogImage} />
        <link rel="icon" type="image/x-icon" href="https://usdebt.wtf/favicon.png"></link>
        <meta property="og:description" content="wtf is going on with the us debt?" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:title" content="usdebt.wtf" />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
      <Analytics />
    </>
  )
}

export default App
