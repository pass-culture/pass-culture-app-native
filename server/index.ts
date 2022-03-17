import { app } from './app'

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[${process.env.ENV}] Listening on port ${PORT}`)
})
