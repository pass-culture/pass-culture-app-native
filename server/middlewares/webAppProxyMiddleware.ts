import { IncomingMessage, ServerResponse } from 'http'

import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'

import { env } from '../libs/environment/env'
import { ENTITY_MAP, EntityKeys } from '../services/entities/types'
import { replaceHtmlMetas } from '../utils/metas'

const { APP_PROXY_URL } = env

const { href } = new URL(APP_PROXY_URL)

const options = {
  target: href,
  changeOrigin: true,
  ws: true,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(metasResponseInterceptor),
}

async function metasResponseInterceptor(
  responseBuffer: Buffer,
  proxyRes: IncomingMessage,
  req: IncomingMessage,
  res: ServerResponse
) {
  if (proxyRes.headers['content-type'] !== 'text/html') {
    return responseBuffer
  }

  // TODO: remove me when PC-14035 is resolved : (404 GCP cloud storage issue, see with OPs)
  res.statusCode = 200

  const html = responseBuffer.toString('utf8')
  const entityEndpoints = Object.keys(ENTITY_MAP)
  const re = new RegExp(`/(${entityEndpoints.join('|')})/(\\d+)`)
  let match
  if (typeof req.url === 'string') {
    match = re.exec(req.url)
  }

  const [endpoint, entityKey, id] = match || []

  if (!id) {
    return html
  }

  try {
    return replaceHtmlMetas(html, endpoint, entityKey as EntityKeys, Number(id))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Replacing HTML metas failed: ${(error as Error).message}`)
    return html
  }
}

export const webAppProxyMiddleware = createProxyMiddleware(options)
