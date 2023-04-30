import { NextApiResponse, NextApiRequest } from 'next'
import PayMeForMyAPI from 'paymeformyapi'
import { getData } from 'core/data'

const paywall = new PayMeForMyAPI({
  lnBitsAdminId: process.env.LN_BITS_ADMIN_ID,
  lnBitsApiKey: process.env.LN_BITS_API_KEY,
  lnBitsURL: process.env.LN_BITS_URL,
  lnBitsAdminInvoiceKey: process.env.LN_BITS_ADMIN_INVOICE_KEY,
  refillAmount: 50, // number of satoshis to refill
  requestCost: 1, // number of satoshis per API call
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { api_token: api_token_from_request } = req.query

  try {
    const { success, api_token, invoice } = await paywall.deductBalance(api_token_from_request as string)

    if (!success) {
      if (!api_token_from_request) {
        return res.redirect(`/api/data?api_token=${api_token}`)
      }

      res.status(402).json({
        statusCode: 402,
        message:
          'Payment required. Pay the invoice then add the api_token to your request - ?api_token={YOUR_TOKEN}',
        api_token,
        invoice,
      })
      return
    }

    const { usd } = await getData()

    res.status(200).json({ usd })
  } catch (error) {
    console.log(error)
    res.status(500).json({ statusCode: 500, message: error.message })
  }
}
