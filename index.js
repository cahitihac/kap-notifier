const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

app.use(cors())
app.get('/', async (req, res) => {
    const { afterDisclosureIndex } = req.query
    const requestURL = afterDisclosureIndex
      ? `https://www.kap.org.tr/tr/api/disclosures?afterDisclosureIndex=${parseInt(
          afterDisclosureIndex
        )}`
      : "https://www.kap.org.tr/tr/api/disclosures";
    console.log(requestURL)
      try {
        const response = await axios.get(requestURL);
        res.status(200).send(response.data)
      } catch (error) {
        console.log(error)
        res.status(200).send([])
      }
})

app.listen(3003, function() {
    console.log('Server is running on PORT: 3003')
})