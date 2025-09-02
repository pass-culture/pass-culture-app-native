import { IncomingMessage, ServerResponse } from 'http'

import { Request } from 'express'
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'

import { env } from '../libs/environment/serverEnv'
import { ENTITY_MAP, EntityKeys } from '../services/entities/types'
import { logger } from '../utils/logging'
import { replaceHtmlMetas } from '../utils/metas'

const { APP_BUCKET_URL } = env

const { href } = new URL(APP_BUCKET_URL)

const ENTITY_PATH_REGEXP = new RegExp(`/(${Object.keys(ENTITY_MAP).join('|')})/(\\d+)`)
const OFFER_DESCRIPTION_PATH_REGEXP = /(\/offre\/\d+)\/description/

const options = {
  target: href,
  changeOrigin: true,
  ws: true,
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(metasResponseInterceptor),
}

const computeCanonicalUrl = (url: URL): URL => {
  const match = OFFER_DESCRIPTION_PATH_REGEXP.exec(url.pathname)
  if (match) {
    const offerUrl = match[1]
    return new URL(`${env.APP_PUBLIC_URL}${offerUrl}`)
  }

  const isThematicHome = url.pathname === '/accueil-thematique'
  const homeIdParams = url.searchParams.get('homeId')
  const additionalParams =
    isThematicHome && homeIdParams ? `?homeId=${encodeURIComponent(homeIdParams)}` : ''
  return new URL(`${env.APP_PUBLIC_URL}${url.pathname}${additionalParams}`)
}

const addCanonicalLinkToHTML = (html: string, url: URL): string => {
  return html.replace('<head>', `<head><link rel="canonical" href="${url.toString()}" />`)
}

const addNoIndexToHTML = (html: string): string =>
  html.replace('<head>', `<head><meta name="robots" content="noindex" />`)

export function fixHTMLFallbackStatusCode(req: IncomingMessage, proxyRes: IncomingMessage) {
  if (proxyRes.statusCode === 404 && !req.headers['range']) {
    return 200
  }
  if (proxyRes.statusCode == null) {
    return 500
  }
  return proxyRes.statusCode
}

export async function metasResponseInterceptor(
  responseBuffer: Buffer,
  proxyRes: IncomingMessage,
  req: IncomingMessage,
  res: ServerResponse
) {
  // When a js chunk is fetched, it is expected to have a content-type: application/javascript
  // if content-type: text/html, it means the index.html fallback as been returned, in such case, we do not want any cache
  if (proxyRes.headers['content-type'] === 'text/html' && (req as Request).path?.endsWith('.js')) {
    // If this is still cached and thus not working, test with no-store instead of no-cache
    res.setHeader('Cache-Control', 'public,no-cache')
    return responseBuffer
  }
  if (proxyRes.headers['content-type'] !== 'text/html') {
    return responseBuffer
  }

  // GCP return 404 when returning the index.html if not the base path, this fix it.
  res.statusCode = fixHTMLFallbackStatusCode(req, proxyRes)

  let html = responseBuffer.toString('utf8')

  let match

  /* istanbul ignore next */
  // error with istanbul thinking there is a else path
  if (req.url) {
    match = ENTITY_PATH_REGEXP.exec(req.url)

    const url = new URL(req.url.startsWith('/') ? env.APP_PUBLIC_URL + req.url : req.url)
    html = addCanonicalLinkToHTML(html, computeCanonicalUrl(url))

    const isSearchPageWithParams =
      url.pathname === '/recherche' && [...url.searchParams.keys()].length
    if (isSearchPageWithParams) {
      html = addNoIndexToHTML(html)
    }
  }

  const [endpoint, entityKey, id] = match || []

  if (!endpoint || !id) {
    return html
  }

  try {
    return await replaceHtmlMetas(html, endpoint, entityKey as EntityKeys, Number(id))
  } catch (error) {
    // when replaceHtmlMetas can really throw error, restore coverage for following lines and add a throw error unit test
    /* istanbul ignore next */
    // eslint-disable-next-line no-console
    logger.info(`Replacing HTML metas failed: ${(error as Error).message}`)
    /* istanbul ignore next */
    return html
  }
}

export const webAppProxyMiddleware = createProxyMiddleware(options)
