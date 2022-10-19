import db from "core/db"
import { getBtcPrice } from "pages/api/bitcoin"
import type { DebtRecord } from "pages/index"
import { US_POPULATION } from "./constants"

// https://www.cbo.gov/data/budget-economic-data
const GDP = [
  { year: 2021, value: 22364775000000 }, // reported
  { year: 2022, value: 24694112000000 }, // estimate
]

const getValues = (records, btcPrice) => {
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
    (previousLatestRecord.us_debt / btcPrice - latestRecord.us_debt / btcPrice) / differenceInMs

  const todaysDate = new Date()
  const msSinceLastReport = todaysDate.getTime() - new Date(latestRecord.date).getTime()
  const initialDebtAmountUSD = msSinceLastReport * changePerMsUsd + latestRecord.us_debt
  const usDebtPerPerson = initialDebtAmountUSD / US_POPULATION
  const initialDebtAmountBTC = msSinceLastReport * changePerMsBtc + latestRecord.us_debt / btcPrice

  // Debt to GDP
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.valueOf() - start.valueOf()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  const thisYearGdp = GDP[1]
  const lastYearGdp = GDP[0]
  const totalAddedThisYear = (thisYearGdp.value - lastYearGdp.value) * (dayOfYear / 365)
  const currentGDP = lastYearGdp.value + totalAddedThisYear

  return {
    usd: {
      initialAmount: initialDebtAmountUSD,
      changePerMs: changePerMsUsd,
      debtPerPerson: usDebtPerPerson,
      currentGDP: currentGDP,
    },
    btc: { initialAmount: initialDebtAmountBTC, changePerMs: changePerMsBtc },
  }
}

export const getData = async () => {
  const { data, error } = await db
    .from<DebtRecord>("money")
    .select("date,us_debt")
    .not("us_debt", "is", null)
    .order("id", { ascending: false })
    .limit(2)

  if (error) throw error

  const price = await getBtcPrice()
  const { usd, btc } = getValues(data, price)

  return {
    usd,
    btc: {
      ...btc,
      price,
    },
  }
}
