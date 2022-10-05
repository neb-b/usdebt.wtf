import { Box, Text, Flex, keyframes } from "@chakra-ui/react"
import Image from "next/image"

import "css-doodle"

// @ts-ignore
const CssDoodle = ({ rule = "" }) => <css-doodle>{rule}</css-doodle>

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Background = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        opacity: 0.05,
      }}
    >
      <CssDoodle
        rule={`
            @grid: 1 / 100% 100%;
            background-size: 83px 135px;
            background-image: @doodle(
                @grid: 2 / 100%;
                background: @pn(#3C2B34, #F7F0E9, #F7F0E9);
                transform-origin:
                @pn(100% 100%, 0 100%, 100% 0, 0 0);
                transform:
                rotateX(45deg)
                skewY(@pn(34deg, -34deg, -34deg));
            );
          `}
      />
    </Box>
  )
}

export default Background
