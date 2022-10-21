import { NextApiResponse, NextApiRequest } from "next"
import { getData } from "core/data"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { usd } = await getData()

    res.status(200).json({ usd })
  } catch (error) {
    console.log(error)
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}
