const records = require("../clean.json")

const map = {}
records.forEach((item) => {
  if (!map[item.record_date]) {
    map[item.record_date] = [Number(item.fytd_expense_amt)]
  } else {
    map[item.record_date].push(Number(item.fytd_expense_amt))
  }
})

const yearMap = {}
Object.keys(map).forEach((key) => {
  const year = key.split("-")[0]
  const recordsForDate = map[key]
  const totalsForDate = recordsForDate.reduce((acc, total) => {
    return acc + total
  }, 0)

  yearMap[year] = totalsForDate.toLocaleString()
})

console.log("yearMap", yearMap)

// console.log(
//   "total",
//   data.reduce((acc, item) => acc + Number(item.fytd_expense_amt), 0).toLocaleString()
// )
