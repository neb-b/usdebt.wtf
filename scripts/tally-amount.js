const data = require("./data.json")

const cleanedData = data
  .filter((record) => {
    return record.expense_group_desc.includes("ACCRUED INTEREST EXPENSE")
  })
  .reduce((acc, record) => {
    return acc + Number(record.fytd_expense_amt)
  }, 0)

console.log("cleaned", cleanedData)
