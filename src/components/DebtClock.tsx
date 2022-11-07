import React from "react"

import { Box, Text, Flex, Link } from "@chakra-ui/react"
import { toWords } from "number-to-words"
import { format } from "core/utils"
import { BTC_SUPPLY, US_POPULATION, US_TAXPAYER_POPULATION } from "core/constants"

const TotalDebt = ({ amount, ...rest }) => {
  const usDebtString = `$${Math.trunc(amount).toLocaleString()}`

  return (
    <Box position="relative" overflow="hidden" {...rest}>
      <Box bg="brand.yellow" display="inline-block" px={2}>
        <Text color="black" fontWeight={900} fontSize={18} position="relative" zIndex={3}>
          Total US National Debt
        </Text>
      </Box>

      <Text
        color="brand.orange"
        fontSize={56}
        fontWeight={900}
        lineHeight={1}
        letterSpacing="-.8px"
        mt={3}
      >
        {toWords(Math.round(amount / 1000000) * 1000000).split("trillion")[0] + " trillion"} dollars
      </Text>

      <Box my={2} position="relative" w="100%" display="flex" alignItems="center">
        <Text
          sx={{
            fontSize: 24,
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
        <Text fontSize={12} ml={2} fontWeight={400}>
          <Link href="#source-1">[1]</Link>
        </Text>
      </Box>
    </Box>
  )
}

const DebtClock = ({ usd, btc }) => {
  const [debt, setDebt] = React.useState(usd.initialAmount)
  const [debtBtc, setDebtBtc] = React.useState(btc.initialAmount)
  const [interest, setInterest] = React.useState(usd.interestInitialAmount)

  const btcRateToMatchDebt = Number(debt / BTC_SUPPLY)
  let btcRateToMatchDebtString = `$${format(btcRateToMatchDebt)}`
  const btcMarketCapPercentOfDebt = ((btc.price * BTC_SUPPLY) / debt) * 100
  const btcMarketCapPercentOfDebtString = `${format(btcMarketCapPercentOfDebt, 2)}%`
  const btcToPayoffDebt = Number(debt / btc.price)
  const usDebtPerPerson = format(debt / US_POPULATION)
  const usDebtPerTaxPayer = format(debt / US_TAXPAYER_POPULATION)
  const debtToGDP = format((debt / usd.currentGDP) * 100)
  const yearlyInterest = format(usd.interestYearlyAmount, 0)
  const interestPaidForFiscalYear = format(interest, 0)

  React.useEffect(() => {
    let amountUsd = usd.initialAmount
    let amountBtc = btc.initialAmount
    let amountInterest = usd.interestInitialAmount

    let interval = setInterval(() => {
      amountUsd += usd.changePerMs * 20
      amountBtc += btc.changePerMs * 20
      amountInterest += usd.interestChangePerMs * 20
      setDebt(amountUsd)
      setDebtBtc(amountBtc)
      setInterest(amountInterest)
    }, 20)
    return () => clearInterval(interval)
  }, [
    usd.initialAmount,
    usd.changePerMs,
    btc.initialAmount,
    btc.changePerMs,
    usd.interestInitialAmount,
    usd.interestChangePerMs,
  ])

  return (
    <Flex direction="column" alignItems="flex-start" position="relative">
      <Box
        sx={{
          mx: [2],
          p: [4],
          maxWidth: [undefined, "460px"],
        }}
      >
        <TotalDebt amount={debt} pb={12} />
        <RowItem
          label="Yearly interest on debt at current rate"
          value={`$${yearlyInterest}`}
          sub={
            <Box fontSize={14}>
              <Text color="brand.yellow" display="inline" fontWeight={600}>
                ${interestPaidForFiscalYear}
              </Text>{" "}
              <Text display="inline-block" color="white">
                paid so far this year
              </Text>
              <Link
                href="#source-2"
                fontSize={12}
                mb="auto"
                ml={2}
                fontWeight={400}
                display="inline-block"
                color="white"
              >
                [2]
              </Link>
            </Box>
          }
        />

        <RowItem label="Debt To GDP" value={`${debtToGDP}%`} />
        <RowItem label="Debt Per Person" value={`$${usDebtPerPerson}`} />
        <RowItem label="Debt Per Taxpayer" value={`$${usDebtPerTaxPayer}`} />
        <RowItem
          label="Fully diluted Bitcoin marketcap as a percentage of total US debt"
          value={btcMarketCapPercentOfDebtString}
        />
        <RowItem
          label="BTC needed to payoff US debt"
          value={`${format(btcToPayoffDebt, 0)} BTC`}
          sub={
            <Box fontSize={14}>
              <Text color="brand.yellow" display="inline" fontWeight={600}>
                {format(btcToPayoffDebt / BTC_SUPPLY, 0)}% greater than total supply
              </Text>
            </Box>
          }
        />
        <RowItem
          label="Price of BTC for market cap to surpass total debt"
          value={btcRateToMatchDebtString}
        />
        <RowItem label="Bitcoin Block Height" value={format(btc.blockHeight, 0)} />

        <Box mt={8} pr={6}>
          <SourceItem
            id={1}
            link="https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny"
          />
          <SourceItem
            id={2}
            link="https://fiscaldata.treasury.gov/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding"
          />
        </Box>
      </Box>
    </Flex>
  )
}

export default DebtClock

type RowItemProps = {
  label: string
  value: string
  sub?: React.ReactNode
}

const RowItem = ({ label, value, sub }: RowItemProps) => {
  return (
    <Box pb={8}>
      <Text fontWeight={400} maxWidth={["300px"]}>
        {label}
      </Text>

      <Text
        sx={{
          fontWeight: 900,
          fontSize: 32,
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {value}
      </Text>

      {sub}
    </Box>
  )
}

type SourceItemProps = {
  link: string
  id: number
}

const SourceItem = ({ link, id }: SourceItemProps) => {
  return (
    <Box id={`source-${id}`} color="white" fontWeight={400} fontSize={12} display="flex" mb={4}>
      <Text mr={2}>[{id}]</Text>

      <Text color="brand.orange">
        <Link href={link}>{link}</Link>
      </Text>
    </Box>
  )
}
