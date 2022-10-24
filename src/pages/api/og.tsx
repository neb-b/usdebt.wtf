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
            padding: "0 64px",
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Chivo",
          }}
        >
          <div
            style={{
              fontSize: 40,
              color: "white",
              fontWeight: "bold",
              display: "flex",
              marginBottom: "32px",
            }}
          >
            current US debt
          </div>
          <div
            style={{
              fontSize: 64,
              color: "#fd691f",
              fontWeight: "bold",
              display: "flex",
            }}
          >
            {toWords(Math.round(usd.initialAmount / 1000000) * 1000000)} dollars
          </div>

          <div
            style={{
              fontSize: 32,
              color: "#FFE34F",
              fontWeight: "bold",
              position: "absolute",
              bottom: "32px",
              right: "32px",
              display: "flex",
            }}
          >
            block {format(btc.blockHeight, 0)}
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
