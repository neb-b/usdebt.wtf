import type { ThemeConfig } from "@chakra-ui/react"

import { extendTheme } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "dark",
}

export const colors = {
  brand: {
    orange: "#fd691f",
    yellow: "#FFE34F",
    bg: "#111111",
  },
}

const theme = {
  styles: {
    global: {
      body: {
        bg: "brand.bg",
      },
    },
  },
  colors,
  fonts: {
    heading: `'Chivo', -apple-system, Helvetica, Arial`,
    body: `'Chivo', -apple-system, Helvetica, Arial`,
  },
  components: {
    Text: {
      baseStyle: {
        color: "white",
        fontWeight: 600,
        letterSpacing: "-0.2px",
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
