const axios = require("axios")

const fs = require("fs")

const US_API_URL =
  "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_expense?page[number]="

const delayIncrement = 500
let delay = 0

const start = async () => {
  try {
    let promises = []

    for (let i = 1; i <= 56; i++) {
      promises.push(
        new Promise((resolve) => setTimeout(resolve, delay)).then(() => axios.get(US_API_URL + i))
      )

      delay += delayIncrement
    }

    console.log(`fetching ${promises.length} pages`)

    let failed = 0

    Promise.all(promises)
      .then((resolvedPromises) => {
        const results = resolvedPromises
          .filter((promise) => {
            if (promise.status !== 200) {
              failed++
              return false
            }
            return true
          })
          .map((promise) => promise.data.data)

        let records = []
        results.forEach((result) => {
          console.log("adding result: ", result.length)
          records.push(...result)
        })

        if (failed > 0) {
          console.log(`failed fetching ${failed} pages`)
        }

        // write the results to a json file
        fs.writeFile("./data.json", JSON.stringify(results), (err) => {
          if (err) {
            console.log("Error writing file", err)
          } else {
            console.log("Successfully wrote file")
          }
        })
      })
      .catch((error) => {
        console.log("error", error)
      })
  } catch (err) {
    console.log("err", err)
    return { props: {} }
  }
}

start()
