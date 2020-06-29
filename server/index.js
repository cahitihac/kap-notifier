const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

let disclosureList = []
let maxDisclosureIndex = 0

app.use(cors())
app.get('/', async (req, res) => {
    const { afterDisclosureIndex } = req.query

    if (afterDisclosureIndex && !isNaN(afterDisclosureIndex)) {
      const lastIndex = disclosureList.findIndex(
        (element) => element.basic.disclosureIndex === parseInt(afterDisclosureIndex)
      )
      const newDisclosureList = disclosureList.slice(0, lastIndex)
      res.status(200).send(newDisclosureList)
    } else {
      res.status(200).send(disclosureList)
    }
})

setInterval(async () => {
  const requestURL = maxDisclosureIndex > 0
    ? `https://www.kap.org.tr/tr/api/disclosures?afterDisclosureIndex=${parseInt(
        maxDisclosureIndex
      )}`
    : 'https://www.kap.org.tr/tr/api/disclosures'

  console.log("requestURL: ", requestURL)

  try {
    const response = await axios.get(requestURL)
    disclosureList = response.data.concat(disclosureList)
    maxDisclosureIndex = disclosureList[0].basic.disclosureIndex
  } catch (error) {
    console.log("error: ", error)
  }
}, 3000)

app.listen(3003, function() {
  console.log('Server is running on PORT: 3003')
})