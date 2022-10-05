import type { ThemeConfig } from "@chakra-ui/react"

import { extendTheme } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "dark",
}

const colors = {
  brand: {
    orange: "#fd691f",
    yellow: "#FFE34F",
  },
}

const theme = {
  colors,
  fonts: {
    heading: `'Chivo', -apple-system, Helvetica, Arial`,
    body: `'Chivo', -apple-system, Helvetica, Arial`,
  },
  components: {
    Text: {
      baseStyle: {
        color: "white",
        fontWeight: 500,
      },
    },
    Heading: {
      baseStyle: {
        color: "white",
      },
    },
  },
  breakpoints: {
    // make it easy for mobile development in browser
    sm: "501px",
    md: "768px",
    lg: "960px",
    xl: "1200px",
    "2xl": "1536px",
  },
}

export default extendTheme(theme, config)
