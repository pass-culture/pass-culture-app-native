import { IncomingMessage, ServerResponse } from 'http'

import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'

import { env } from '../libs/environment/env'
import { ENTITY_MAP, EntityKeys } from '../services/entities/types'
import { logger } from '../utils/logging'
import { replaceHtmlMetas } from '../utils/metas'

const { APP_PROXY_URL } = env

const { href } = new URL(APP_PROXY_URL)

const ENTITY_PATH_REGEXP = new RegExp(`/(${Object.keys(ENTITY_MAP).join('|')})/(\\d+)`)

const options = {
  target: href,
  changeOrigin: true,
  ws: true,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(metasResponseInterceptor),
}

export async function metasResponseInterceptor(
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

  let match

  /* istanbul ignore next */
  // error with istanbul thinking there is a else path
  if (req.url) {
    match = ENTITY_PATH_REGEXP.exec(req.url)
  }

  const [endpoint, entityKey, id] = match || []

  if (!id) {
    return html
  }

  try {
    return replaceHtmlMetas(html, endpoint, entityKey as EntityKeys, Number(id))
  } catch (error) {
    // FIXME: when replaceHtmlMetas can really throw error, restore coverage for following lines and add a throw error unit test
    /* istanbul ignore next */
    // eslint-disable-next-line no-console
    logger.info(`Replacing HTML metas failed: ${(error as Error).message}`)
    /* istanbul ignore next */
    return html
  }
}

export const webAppProxyMiddleware = createProxyMiddleware(options)
