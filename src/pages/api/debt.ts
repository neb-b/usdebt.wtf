import axios from 'axios'
import { NextApiResponse, NextApiRequest } from 'next'
import db from 'core/db'

import type { DebtRecord } from 'pages/index'

const US_DEBT_API_URL =
  'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?page[number]='
const PAGE = 82

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: dbData, error } = await db
      .from<DebtRecord>('money')
      .select('*')
      .filter('us_debt', 'is', null)
      .order('id', { ascending: false })

    if (error) {
      throw error
    }

    let apiData
    let records
    let latestPageNumber = PAGE

    while (true) {
      const response = await axios.get(`${US_DEBT_API_URL}${latestPageNumber}`)
      apiData = response.data
      records = apiData.data

      if (apiData.meta['total-pages'] === latestPageNumber) {
        break
      } else {
        latestPageNumber = apiData.meta['total-pages']
      }
    }

    let itemsToUpdate = []
    records.forEach((record) => {
      const dbRecordWithMatchingDate = dbData.find((dbItem) => dbItem.date === record.record_date)
      if (dbRecordWithMatchingDate) {
        itemsToUpdate.push({
          ...dbRecordWithMatchingDate,
          us_debt: Number(record.tot_pub_debt_out_amt).toFixed(),
        })
      }
    })

    if (!itemsToUpdate.length) {
      res.status(200).json({ message: 'No new data' })
      return
    }

    const { error: updateError } = await db.from('money').upsert(itemsToUpdate)

    if (updateError) {
      throw updateError
    }

    res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}
