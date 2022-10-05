import React from "react"

import axios from "axios"
import { Box, Text, Flex } from "@chakra-ui/react"
import { GetServerSideProps } from "next"

import db from "core/db"
import { getBtcPrice } from "pages/api/bitcoin"
import DebtClock from "components/DebtClock"
import { getData } from "core/data"

export type DebtRecord = {
  id: number
  created_at: string
  date: string
  us_debt: number
  btc_debt: number
}

type ErrorProps = { error: string; records: undefined; btcPrice: undefined }
type DataProps = {
  error: undefined
  usd: {
    initialAmount: number
    changePerMs: number
    debtPerPerson: number
  }
  btc: {
    price: number
    initialAmount: number
    changePerMs: number
  }
}

type Props = ErrorProps | DataProps

const Home: React.FC<Props> = ({ error: serverSideError, usd, btc }) => {
  return (
    <Box>
      {serverSideError && (
        <Text color="red.500" bg="red.200" p={4} m={4} borderRadius={10}>
          {serverSideError}
        </Text>
      )}

      {usd && btc && <DebtClock usd={usd} btc={btc} />}
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (process.env.NODE_ENV === "production") {
    try {
      await db.from("access").insert({ a: 1 })
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
    let message = "Unknown Error"

    if (err instanceof Error) {
      message = err.message
    }
    return { props: { error: message } }
  }
}

export default Home
