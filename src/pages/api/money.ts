import axios from "axios"
import { NextApiResponse, NextApiRequest } from "next"
import db from "core/db"

import type { DebtRecord } from "pages/index"

const US_API_URL = "https://api.stlouisfed.org/fred/"
const PAGE = 55

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { auth },
  } = req

  if (process.env.NODE_ENV === "production" && auth !== process.env.PING_AUTH) {
    res.status(401).json({ error: "unauthorized" })
    return
  }

  try {
    const { data: apiData } = await axios.get(`${US_API_URL}${PAGE}`)
    const records = apiData.data
    console.log("records", records.length)
    const filtered = records
      .filter((record) => record.record_date !== "2022-08-31")
      .map((record) => Number(record.fytd_expense_amt))
      .reduce((acc, curr) => acc + curr, 0)
    console.log("filtered.length", filtered.toLocaleString())

    res.status(200).json({ status: "ok" })
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}
