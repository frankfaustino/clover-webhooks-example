require('dotenv').config()
const axios = require('axios')
const express = require('express')
const ngrok = require('ngrok')

const app = express()
app.use(express.json())

// Variables
const { APP_ID, APP_SECRET, MERCHANT_ID, NGROK_AUTH } = process.env
const TARGET_ENV = 'https://sandbox.dev.clover.com' // Sandbox
const TARGET_API = 'https://apisandbox.dev.clover.com'
const PORT = process.env.PORT || 8000
const REDIRECT_URL = `http://localhost:${PORT}`
let ACCESS_TOKEN = null

// OAuth Endpoint
app.get('/', (req, res) => authenticate(req, res))

// Webhook Endpoint
app.post('/', (req, res) => {
  console.log(req.body) // Contains the verificationCode needed to subscribe to Clover webhooks
  res.status(200).send('OK')
})

// Inventory Endpoint — access only after OAuth and settingup Webhook
app.post('/increment_quantity', (req, res) => incrementQuantity(req, res))

const authenticate = async (req, res) => {
  const URL = `${TARGET_ENV}/oauth/authorize?client_id=${APP_ID}&state=testing123&redirect_uri=${REDIRECT_URL}`

  req.query && req.query.code ? await requestAPIToken(res, req.query.code) : await res.redirect(URL)
}

const requestAPIToken = async (res, code) => {
  const URL = `${TARGET_ENV}/oauth/token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}`

  const response = await axios
    .get(URL)
    .catch(err => res.send(err.message))

  if (response && response.data) {
    ACCESS_TOKEN = response.data.access_token
    res.send(`<p>${ACCESS_TOKEN}</p>`)
  }
}

const incrementQuantity = async (req, res) => {
  const { id, quantity } = req.body

  const requestBody = {
    item: { id },
    quantity
  }

  const response = await axios
    .post(`${TARGET_API}/v3/merchants/${MERCHANT_ID}/item_stocks/${id}?access_token=${ACCESS_TOKEN}`, requestBody)
    .catch(err => res.send(err.message))

  if (response && response.data) {
    res.send(response.data)
  }
}

app.listen(PORT, async () => {
  try {
    const URL = await ngrok.connect({
      addr: PORT,
      authtoken: NGROK_AUTH,
      region: 'us'
    })
    console.log(`🚀 Server is listening on port ${PORT} and ngrok is running on ${URL}`)
  } catch (e) {
    console.log(e.message)
  }
})