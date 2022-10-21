import type { NextApiRequest, NextApiResponse } from "next"
import Twitter from "twitter"
import { getData } from "core/data"
import { format } from "core/utils"

var client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { auth },
  } = req

  if (process.env.NODE_ENV === "production" && auth !== process.env.PING_AUTH) {
    res.status(401).json({ error: "unauthorized" })
    return
  }

  try {
    const { usd } = await getData()

    await tweet("US Debt: $" + format(usd.initialAmount, 0))
    res.status(200).json({ status: "ok" })
  } catch (e: any) {
    console.log(`error: ${e}`)
    return res.status(400).json({ status: e.message })
  }
}

const tweet = async (status) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      client.post("statuses/update", { status }, function (error, tweet) {
        if (error) {
          reject(error)
        }

        return resolve()
      })
    } catch (e) {
      reject(e)
    }
  })
}
