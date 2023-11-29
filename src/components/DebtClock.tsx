import React from 'react'
import { toWords } from 'number-to-words'
import { format } from 'core/utils'
import { BTC_SUPPLY, US_POPULATION, US_TAXPAYER_POPULATION } from 'core/constants'

const DebtClock = ({ usd, btc, chart }) => {
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
    <div className="flex flex-col items-start relative">
      <div className="">
        <div className="relative">
          <div className="bg-yellow-400 p-2 inline-block">
            <div className="text-black font-[900] text-lg">Total US National Debt</div>
          </div>

          <h1 className="mt-6 text-6xl leading-[54px] font-extrabold">
            {toWords(Math.round(debt / 1000000) * 1000000).split('trillion')[0] + ' trillion'} dollars
          </h1>

          <div className="mt-4 flex items-center">
            <div className="text-2xl text-white inline-block px-2 py-1 mr-2">{`$${Math.trunc(
              debt
            ).toLocaleString()}`}</div>

            <a href="#source-1">[1]</a>
          </div>
        </div>

        <div className="mt-10 space-y-8">
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
              <div className="text-base">
                <span className="text-yellow-500 inline font-semibold">
                  {format(btcToPayoffDebt / BTC_SUPPLY, 0)}x greater than total supply
                </span>
              </div>
            }
          />
          <RowItem
            label="Price of BTC for market cap to surpass total debt"
            value={btcRateToMatchDebtString}
          />
          <RowItem label="Bitcoin Block Height" value={format(btc.blockHeight, 0)} />
        </div>

        <div className="mt-8 pr-6">
          <SourceItem
            id={1}
            link="https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny"
          />
          {/* <SourceItem
    id={2}
    link="https://fiscaldata.treasury.gov/datasets/interest-expense-debt-outstanding/interest-expense-on-the-public-debt-outstanding"
  /> */}
        </div>
      </div>
    </div>
  )
}

const RowItem = ({ label, value, sub }: { label: string; value: string; sub?: React.ReactNode }) => {
  return (
    <div className="">
      <p className="font-normal max-w-[300px]">{label}</p>

      <p className="font-extrabold text-4xl">{value}</p>

      {sub}
    </div>
  )
}

const SourceItem = ({ link, id }: { link: string; id: number }) => {
  return (
    <div id={`source-${id}`} className="text-white font-normal text-sm flex mb-4">
      <p className="mr-2">[{id}]</p>

      <p className="text-orange-500 text-xs whitespace-pre-wrap">
        <a href={link}>{link}</a>
      </p>
    </div>
  )
}

export default DebtClock
