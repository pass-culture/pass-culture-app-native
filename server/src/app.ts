import { dirname, join } from 'path'

import express from 'express'

import { webAppProxyMiddleware } from './middlewares/webAppProxyMiddleware'

export const app = express()

const options = {
  // We set the index option at false because `public/index.html` is displayed instead of the homepage
  index: false,
}

const rootFolder = dirname(dirname(__dirname))

// We want to serve static files from the root folder /public
// https://expressjs.com/en/4x/api.html#express.static
app.use(express.static(join(rootFolder, 'public'), options))

app.use('*', webAppProxyMiddleware)
