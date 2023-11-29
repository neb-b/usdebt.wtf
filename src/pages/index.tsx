import React from 'react'

import { GetServerSideProps } from 'next'

import db from 'core/db'

import DebtClock from 'components/DebtClock'
import Layout from 'components/Layout'
import { getData } from 'core/data'

export type DebtRecord = {
  id: number
  created_at: string
  date: string
  us_debt: number
  btc_debt: number
}

type Props = {
  error?: string
  visitors?: number
  usd?: {
    initialAmount: number
    changePerMs: number
    debtPerPerson: number
    currentGDP: number
    interestInitialAmount: number
    interestChangePerMs: number
    interestYearlyAmount: number
  }
  btc?: {
    price: number
    initialAmount: number
    changePerMs: number
  }
  chart: { date: string; us_debt: number; btc_debt: number }[]
}

const Home: React.FC<Props> = ({ error: serverSideError, usd, btc, chart }) => {
  return (
    <Layout>
      {serverSideError && <div className="bg-red-300 text-red-800 p-4 m-4 rounded">{serverSideError}</div>}

      {usd && btc && <DebtClock usd={usd} btc={btc} chart={chart} />}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      const { referer = '' } = context.req.headers
      const { error } = await db
        .from('access')
        .insert({ created_at: new Date().toISOString().toLocaleString(), referer })

      if (error) {
        throw error
      }
    } catch (e) {}
  }

  try {
    const { usd, btc, chart } = await getData(Date.now())

    return {
      props: {
        usd,
        btc,
        chart,
      },
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(err)
    }

    let message = 'Unknown Error'

    if (err instanceof Error) {
      message = err.message
    }
    return { props: { error: message } }
  }
}

export default Home
