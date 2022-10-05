import React from "react"

import { Box, Text, Flex } from "@chakra-ui/react"
import { toWords } from "number-to-words"
import { BTC_SUPPLY, US_POPULATION, US_TAXPAYER_POPULATION } from "core/data"

const TotalDebt = ({ amount }) => {
  const usDebtString = `$${Math.trunc(amount).toLocaleString()}`

  return (
    <Box pb={0} pt={6} px={[6, 8]} position="relative" overflow="hidden" width="100%">
      <Box bg="brand.yellow" display="inline-block" px={2}>
        <Text color="black" fontWeight="bold" fontSize={18} position="relative" zIndex={3}>
          Total US National Debt
        </Text>
      </Box>

      <Text
        color="brand.orange"
        fontSize={56}
        fontWeight={800}
        lineHeight={1}
        letterSpacing="-.8px"
        mt={3}
      >
        {toWords(Math.round(amount / 1000000) * 1000000).split("trillion")[0] + " trillion"} dollars
      </Text>

      <Box my={2} position="relative" w="100%">
        <Text
          sx={{
            fontSize: 24,
            fontWeight: 500,
            whiteSpace: "normal",
            display: "inline",
            lineHeight: 1,
            letterSpacing: "2px",
            wordBreak: "break-word",
            zIndex: 2,
            position: "relative",
          }}
        >
          {usDebtString}
        </Text>
      </Box>
    </Box>
  )
}

const format = (amount: number, decimals = 2) =>
  amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

const DebtClock = ({ usd, btc }) => {
  const [debt, setDebt] = React.useState(usd.initialAmount)
  const [debtBtc, setDebtBtc] = React.useState(btc.initialAmount)

  const btcRateToMatchDebt = Number(debt / BTC_SUPPLY)
  let btcRateToMatchDebtString = `$${format(btcRateToMatchDebt)}`

  const btcMarketCapPercentOfDebt = ((btc.price * BTC_SUPPLY) / debt) * 100
  const btcMarketCapPercentOfDebtString = `${format(btcMarketCapPercentOfDebt, 2)}%`

  const usDebtPerPerson = format(debt / US_POPULATION)
  const usDebtPerTaxPayer = format(debt / US_TAXPAYER_POPULATION)

  React.useEffect(() => {
    let amountUsd = usd.initialAmount
    let amountBtc = btc.initialAmount

    let interval = setInterval(() => {
      amountUsd += usd.changePerMs * 20
      amountBtc += btc.changePerMs * 20
      setDebt(amountUsd)
      setDebtBtc(amountBtc)
    }, 20)

    return () => clearInterval(interval)
  }, [usd.initialAmount, usd.changePerMs, btc.initialAmount, btc.changePerMs])

  return (
    <Flex direction="column" alignItems="flex-start" position="relative">
      <TotalDebt amount={debt} />

      <Box
        sx={{
          mt: 6,
          mx: [2],
          p: [4],
          maxWidth: [undefined, "400px"],
        }}
      >
        <Box pb={8}>
          <Text>Debt Per Person</Text>

          <Text
            sx={{
              fontWeight: 900,
              fontSize: 32,
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            ${usDebtPerPerson}
          </Text>
        </Box>
        <Box pb={8}>
          <Text>Debt Per Taxpayer</Text>

          <Text
            sx={{
              fontWeight: 900,
              fontSize: 32,
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            ${usDebtPerTaxPayer}
          </Text>
        </Box>

        <Box pb={8}>
          <Text>Fully diluted Bitcoin marketcap as a percentage of total US debt</Text>

          <Text
            sx={{
              fontWeight: 900,
              fontSize: 32,
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            {btcMarketCapPercentOfDebtString}
          </Text>
        </Box>

        <Box pb={8}>
          <Text>Price of BTC for market cap to surpass total debt</Text>

          <Text
            sx={{
              fontWeight: 900,
              fontSize: 32,
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            {btcRateToMatchDebtString}
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default DebtClock
