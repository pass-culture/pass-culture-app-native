import { IncomingMessage } from 'http'

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

export async function metasResponseInterceptor(
  responseBuffer: Buffer,
  proxyRes: IncomingMessage,
  req: IncomingMessage
) {
  if (proxyRes.headers['content-type'] !== 'text/html') {
    return responseBuffer
  }

  const html = responseBuffer.toString('utf8')
  const entityEndpoints = Object.keys(ENTITY_MAP)
  const re = new RegExp(`/(${entityEndpoints.join('|')})/(\\d+)`)
  let match

  /* istanbul ignore next */
  // error with istanbul thinking there is a else path
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
    // FIXME: when replaceHtmlMetas can really throw error, restore coverage for following lines and add a throw error unit test
    /* istanbul ignore next */
    // eslint-disable-next-line no-console
    console.log(`Replacing HTML metas failed: ${(error as Error).message}`)
    /* istanbul ignore next */
    return html
  }
}

export const webAppProxyMiddleware = createProxyMiddleware(options)
