import express from 'express'

declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string
  }
}

const app = express()
const port = process.env['PORT']

if (!port) {
  throw new Error('a PORT is needed to start')
}

app.use(express.json())

let calledAnalytics: unknown[] = []

app.post('/', (req, res) => {
  calledAnalytics.push(req.body.analyticsKey)
  console.debug('post', calledAnalytics)
  res.sendStatus(201)
})

app.get('/', (_req, res) => {
  res.send(JSON.stringify(calledAnalytics))
  console.debug('get', calledAnalytics)
})

app.delete('/', (_req, res) => {
  calledAnalytics = []
  console.debug('delete', calledAnalytics)
  res.sendStatus(204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
