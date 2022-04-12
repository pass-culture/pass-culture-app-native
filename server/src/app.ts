import express from 'express'

import { webAppProxyMiddleware } from './middlewares/webAppProxyMiddleware'

export const app = express()

app.use('*', webAppProxyMiddleware)
