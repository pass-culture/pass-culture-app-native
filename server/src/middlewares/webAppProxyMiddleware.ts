import { IncomingMessage, ServerResponse } from 'http'

import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'

import { env } from '../libs/environment/env'
import { ENTITY_MAP, EntityKeys } from '../services/entities/types'
import { logger } from '../utils/logging'
import { replaceHtmlMetas } from '../utils/metas'

const { APP_BUCKET_URL } = env

const { href } = new URL(APP_BUCKET_URL)

const ENTITY_PATH_REGEXP = new RegExp(`/(${Object.keys(ENTITY_MAP).join('|')})/(\\d+)`)

const options = {
  target: href,
  changeOrigin: true,
  ws: true,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(metasResponseInterceptor),
}

const addCanonicalLinkToHTML = (html: string, href: string): string => {
  const url = new URL(href.startsWith('/') ? env.APP_PUBLIC_URL + href : href)

  return html.replace(
    '<head>',
    `<head><link rel="canonical" href="${env.APP_PUBLIC_URL}${url.pathname}" />`
  )
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

  // GCP return 404 when returning the index.html if not the base path, this fix it.
  res.statusCode = 200

  let html = responseBuffer.toString('utf8')

  let match

  /* istanbul ignore next */
  // error with istanbul thinking there is a else path
  if (req.url) {
    match = ENTITY_PATH_REGEXP.exec(req.url)
    html = addCanonicalLinkToHTML(html, req.url)
  }

  const [endpoint, entityKey, id] = match || []

  if (!id) {
    return html
  }

  try {
    return replaceHtmlMetas(html, endpoint, entityKey as EntityKeys, Number(id))
  } catch (error) {
    // FIXME(kopax): when replaceHtmlMetas can really throw error, restore coverage for following lines and add a throw error unit test
    /* istanbul ignore next */
    // eslint-disable-next-line no-console
    logger.info(`Replacing HTML metas failed: ${(error as Error).message}`)
    /* istanbul ignore next */
    return html
  }
}

export const webAppProxyMiddleware = createProxyMiddleware(options)
