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

const addCanonicalLinkToHTML = (html: string, url: URL): string => {
  const isThematicHome = url.pathname === '/accueil-thematique'
  const homeIdParams = url.searchParams.get('homeId')
  const additionalParams = isThematicHome && homeIdParams ? `?homeId=${homeIdParams}` : ''
  return html.replace(
    '<head>',
    `<head><link rel="canonical" href="${env.APP_PUBLIC_URL}${url.pathname}${additionalParams}" />`
  )
}

const addNoIndexToHTML = (html: string): string =>
  html.replace('<head>', `<head><meta name="robots" content="noindex" />`)

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

    const url = new URL(req.url.startsWith('/') ? env.APP_PUBLIC_URL + req.url : req.url)
    html = addCanonicalLinkToHTML(html, url)

    const isSearchPageWithParams =
      url.pathname === '/recherche' && [...url.searchParams.keys()].length
    if (isSearchPageWithParams) {
      html = addNoIndexToHTML(html)
    }
  }

  const [endpoint, entityKey, id] = match || []

  if (!id) {
    return html
  }

  try {
    return await replaceHtmlMetas(html, endpoint, entityKey as EntityKeys, Number(id))
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
