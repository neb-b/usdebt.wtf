import React from "react"

import axios from "axios"
import { Box, Text, Flex, Link } from "@chakra-ui/react"

import GithubLogo from "./GithubLogo"

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const [visitors, setVisitors] = React.useState<number | null>(null)

  React.useEffect(() => {
    axios.get("/api/visitors").then((res) => {
      setVisitors(res.data.visitors)
    })
  })

  return (
    <Box
      sx={{
        bg: "brand.bg",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <Flex
        alignItems="center"
        px={[6]}
        py={[4]}
        sx={{ zIndex: 1, position: "relative", height: "80px" }}
      >
        <Text fontSize={28} fontWeight={800} color="brand.orange">
          wtf??
        </Text>
      </Flex>
      <Box
        sx={{
          minHeight: "100vh" || `calc(100vh - 80px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mx: "auto", maxWidth: "30rem" }}>
          <Box pb={20}>{children}</Box>
        </Box>

        <Flex p={4} alignItems="center" mt="auto" width="100%">
          <Link color="brand.orange" href="https://github.com/neb-b/debtclock">
            <Flex alignItems="center">
              <GithubLogo />
              <Text color="brand.orange" ml={2}>
                Github
              </Text>
            </Flex>
          </Link>

          <Flex ml={4}>
            <Text mr={1}>Inspired by</Text>
            <Link color="brand.orange" href="https://usdebtclock.org">
              usdebtclock.org
            </Link>
          </Flex>

          {visitors && (
            <Text ml="auto" fontSize={12}>
              {visitors.toLocaleString()} visitors
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  )
}

export default Layout
