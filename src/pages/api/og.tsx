import { ImageResponse } from "@vercel/og"
import { getData } from "core/data"
import { format } from "core/utils"
import { toWords } from "number-to-words"

export const config = {
  runtime: "experimental-edge",
}

const font = fetch(new URL("../../theme/chivo/Chivo-Black.otf", import.meta.url)).then((res) =>
  res.arrayBuffer()
)

export default async function handler() {
  try {
    const fontData = await font
    const { usd, btc } = await getData()

    return new ImageResponse(
      (
        <div
          style={{
            background: "#111",
            width: "100%",
            height: "100%",
            padding: "0 36px",
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            justifyContent: "center",
            fontFamily: "Chivo",
          }}
        >
          <div
            style={{
              fontSize: 64,
              color: "white",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            current US debt
          </div>
          <div
            style={{
              fontSize: 90,
              lineHeight: 0.95,
              color: "#fd691f",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            {toWords(Math.round(usd.initialAmount / 1000000) * 1000000)} dollars
          </div>

          <div
            style={{
              fontSize: 42,
              color: "#FFE34F",
              fontWeight: "bold",
              position: "absolute",
              bottom: "24px",
              right: "24px",
              display: "flex",
            }}
          >
            {format(btc.blockHeight, 0)}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: "Chivo",
            data: fontData,
            style: "normal",
          },
        ],
      }
    )
  } catch (error) {
    console.error(error)
    return
  }
}
