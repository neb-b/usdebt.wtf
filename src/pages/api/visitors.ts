import { NextApiResponse, NextApiRequest } from "next"
import db from "core/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: accessData, error: accessError } = await db
      .from<{ id: number }>("access")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)

    if (accessError) throw accessError

    res.status(200).json({ visitors: accessData[0].id })
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}
