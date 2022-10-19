import React from "react"

import axios from "axios"
import { Box, Text, Flex } from "@chakra-ui/react"
import { GetServerSideProps } from "next"

import db from "core/db"
import { getBtcPrice } from "pages/api/bitcoin"
import DebtClock from "components/DebtClock"
import Layout from "components/Layout"
import { getData } from "core/data"

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
  }
  btc?: {
    price: number
    initialAmount: number
    changePerMs: number
  }
}

const Home: React.FC<Props> = ({ error: serverSideError, usd, btc }) => {
  return (
    <Layout>
      <Box>
        {serverSideError && (
          <Text color="red.500" bg="red.200" fontWeight={600} p={4} m={4} borderRadius={10}>
            {serverSideError}
          </Text>
        )}

        {usd && btc && <DebtClock usd={usd} btc={btc} />}
      </Box>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (process.env.NODE_ENV === "production") {
    try {
      const { referer = "" } = context.req.headers
      const { error } = await db
        .from("access")
        .insert({ created_at: new Date().toISOString().toLocaleString(), referer })

      if (error) {
        throw error
      }
    } catch (e) {}
  }

  try {
    const { data, error } = await db
      .from<DebtRecord>("money")
      .select("date,us_debt")
      .not("us_debt", "is", null)
      .order("id", { ascending: false })
      .limit(2)

    if (error) throw error

    const price = await getBtcPrice()
    const { usd, btc } = getData(data, price)

    return {
      props: {
        usd,
        btc: {
          ...btc,
          price,
        },
      },
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.log(err)
    }

    let message = "Unknown Error"

    if (err instanceof Error) {
      message = err.message
    }
    return { props: { error: message } }
  }
}

export default Home
