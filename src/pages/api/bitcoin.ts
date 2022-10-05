import axios from "axios"
import { NextApiResponse, NextApiRequest } from "next"
import db from "core/db"

const BTC_API_URL = `https://api.coinbase.com/v2/prices/spot?currency=USD`

export const getBtcPrice = async () => {
  const { data: btcData } = await axios.get(BTC_API_URL)
  return btcData.data.amount
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { auth },
  } = req

  if (process.env.NODE_ENV === "production" && auth !== process.env.PING_AUTH) {
    res.status(401).json({ error: "unauthorized" })
    return
  }

  try {
    const btcPrice = await getBtcPrice()
    const date = new Date().toISOString().split("T")[0]

    const { error } = await db.from("money").insert({
      btc_price: Number(btcPrice).toFixed(0),
      date,
    })

    if (error) {
      throw error
    }

    res.status(200).json({ status: "ok" })
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}
