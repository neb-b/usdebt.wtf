import React from "react"

import axios from "axios"
import { useRouter } from "next/router"
import { Box, Text, Flex, Link } from "@chakra-ui/react"

import GithubLogo from "./GithubLogo"

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const { query } = useRouter()
  const [visitors, setVisitors] = React.useState<number | null>(null)
  const isTweetScreenshot = !!query.screenshot

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
        px: isTweetScreenshot ? 4 : 0,
      }}
    >
      {!isTweetScreenshot && (
        <Flex
          alignItems="center"
          px={[6]}
          py={[4]}
          sx={{ zIndex: 1, position: "relative", height: "80px" }}
        >
          <Text fontSize={28} fontWeight={800} color="brand.orange">
            wtf?
          </Text>
        </Flex>
      )}
      <Box
        sx={{
          minHeight: "100vh" || `calc(100vh - 80px)`,
          display: "flex",
          flexDirection: "column",
          pt: isTweetScreenshot ? 4 : 0,
        }}
      >
        <Box sx={{ mx: "auto", maxWidth: "30rem", mt: isTweetScreenshot ? 0 : 6 }}>
          <Box pb={20}>{children}</Box>
        </Box>

        <Flex
          p={4}
          flexDirection={["column", "row"]}
          alignItems={["flex-start", "center"]}
          mt="auto"
          width="100%"
        >
          <Link color="brand.orange" href="https://github.com/neb-b/debtclock" mb={[2, 0]}>
            <Flex alignItems="center">
              <GithubLogo />
              <Text color="brand.orange" ml={2}>
                Github
              </Text>
            </Flex>
          </Link>

          <Flex ml={[0, 4]}>
            <Text mr={1}>Inspired by</Text>
            <Link color="brand.orange" href="https://usdebtclock.org">
              usdebtclock.org
            </Link>
          </Flex>

          {visitors && (
            <Text ml={[0, "auto"]} fontSize={12} mt={[4, 0]}>
              {visitors.toLocaleString()} visitors
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  )
}

export default Layout
