export const BTC_SUPPLY = 21000000
export const US_POPULATION = 329500000
export const US_TAXPAYER_POPULATION = 148245929
export const US_GDP = 20940000000000

export const getData = (records, btcPrice) => {
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
  const initialAmountUsd = msSinceLastReport * changePerMsUsd + latestRecord.us_debt
  const initialAmountBtc = msSinceLastReport * changePerMsBtc + latestRecord.us_debt / btcPrice

  const usDebtPerPerson = initialAmountUsd / US_POPULATION

  return {
    usd: {
      initialAmount: initialAmountUsd,
      changePerMs: changePerMsUsd,
      debtPerPerson: usDebtPerPerson,
    },
    btc: { initialAmount: initialAmountBtc, changePerMs: changePerMsBtc },
  }
}
