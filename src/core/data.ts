import db from "core/db"
import { getBtcData } from "pages/api/bitcoin"
import type { BtcData } from "pages/api/bitcoin"
import type { DebtRecord } from "pages/index"
import { US_POPULATION } from "./constants"
import interestData from "./interest-payment-history.json"

// https://www.cbo.gov/data/budget-economic-data
const GDP = [
  { year: 2021, value: 22364775000000 }, // reported
  { year: 2022, value: 24694112000000 }, // estimate
]

const getValues = (records, btcData, date) => {
  if (!records) {
    return {}
  }

  const previousLatestRecord = records[records.length - 1]
  const latestRecord = records[records.length - 2]

  const latestRecordDate = new Date(latestRecord.date)
  const previousLatestRecordDate = new Date(previousLatestRecord.date)
  const differenceInMs = previousLatestRecordDate.getTime() - latestRecordDate.getTime()
  const changePerMsUsd = (previousLatestRecord.us_debt - latestRecord.us_debt) / differenceInMs
  const changePerMsBtc =
    (previousLatestRecord.us_debt / btcData.price - latestRecord.us_debt / btcData.price) /
    differenceInMs

  const todaysDate = new Date(date)
  const msSinceLastReport = todaysDate.getTime() - new Date(latestRecord.date).getTime()
  const initialDebtAmountUSD = msSinceLastReport * changePerMsUsd + latestRecord.us_debt
  const usDebtPerPerson = initialDebtAmountUSD / US_POPULATION
  const initialDebtAmountBTC =
    msSinceLastReport * changePerMsBtc + latestRecord.us_debt / btcData.price

  // Debt to GDP
  const now = new Date(date)
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.valueOf() - start.valueOf()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  const thisYearGdp = GDP[1]
  const lastYearGdp = GDP[0]
  const totalAddedThisYear = (thisYearGdp.value - lastYearGdp.value) * (dayOfYear / 365)
  const currentGDP = lastYearGdp.value + totalAddedThisYear

  // Interest
  const latestInterestRecord = interestData[interestData.length - 1]
  const secondLatestInterestRecord = interestData[interestData.length - 2]
  const firstDayOfFiscalYear = new Date(`${todaysDate.getFullYear()}-10-01`)
  const msSinceFirstDayOfFiscalYear = todaysDate.getTime() - firstDayOfFiscalYear.getTime()
  const msInYear = 1000 * 60 * 60 * 24 * 365
  const msLeftInYear = msInYear - msSinceFirstDayOfFiscalYear

  let initialInterestAmount: number
  let interestPaymentRateInMs: number
  let estimatedYearlyInterest: number
  // If last reported is september 30, then we are estimating the very first interest data of the year
  // Take current rate in ms and multiply by ms since first day of fiscal year
  if (latestInterestRecord.date.includes("-09-30")) {
    interestPaymentRateInMs =
      (latestInterestRecord.total - secondLatestInterestRecord.total) / 30.5 / 24 / 60 / 60 / 1000
    initialInterestAmount = msSinceFirstDayOfFiscalYear * interestPaymentRateInMs
    estimatedYearlyInterest = interestPaymentRateInMs * msInYear
  } else if (latestInterestRecord.date.includes("-10-31")) {
    const msInFirstRecordedMonth = 1000 * 60 * 60 * 24 * 31
    interestPaymentRateInMs = latestInterestRecord.total / msInFirstRecordedMonth
    initialInterestAmount = msSinceFirstDayOfFiscalYear * interestPaymentRateInMs
    estimatedYearlyInterest = latestInterestRecord.total + interestPaymentRateInMs * msLeftInYear
  } else {
    const msBetweenLastTwoRecordedMonths =
      // @ts-ignore
      new Date(latestInterestRecord.date) - new Date(secondLatestInterestRecord.date)

    interestPaymentRateInMs =
      (latestInterestRecord.total + secondLatestInterestRecord.total) /
      msBetweenLastTwoRecordedMonths
    initialInterestAmount =
      latestInterestRecord.total + msSinceFirstDayOfFiscalYear * interestPaymentRateInMs

    // Figure out yearly estimate by adding last reported amount + (currentRateInMs * msLeftInYear)
    estimatedYearlyInterest = latestInterestRecord.total + interestPaymentRateInMs * msLeftInYear
  }

  return {
    usd: {
      initialAmount: initialDebtAmountUSD,
      changePerMs: changePerMsUsd,
      debtPerPerson: usDebtPerPerson,
      currentGDP: currentGDP,
      interestInitialAmount: initialInterestAmount,
      interestChangePerMs: interestPaymentRateInMs,
      interestYearlyAmount: estimatedYearlyInterest,
    },
    btc: { initialAmount: initialDebtAmountBTC, changePerMs: changePerMsBtc },
  }
}

export const getData = async (date = Date.now()) => {
  const getMoney = async () => {
    const { data, error } = await db
      .from<DebtRecord>("money")
      .select("date,us_debt")
      .not("us_debt", "is", null)
      .order("id", { ascending: false })
      .limit(2)

    if (error) {
      throw error
    }

    return data
  }

  const promises = [getMoney(), getBtcData()]
  const results = await Promise.all(promises)
  const [moneyData, btcData] = results

  const { usd, btc } = getValues(moneyData as DebtRecord[], btcData as BtcData, date)

  return {
    usd,
    btc: {
      ...btc,
      ...(btcData as BtcData),
    },
  }
}
