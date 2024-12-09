import { NextFunction, Request, Response } from 'express'

import { env } from '../libs/environment/env'

const hasMobileIOS = (userAgent: string) =>
  userAgent.includes('Mobile') && (userAgent.includes('iPhone') || userAgent.includes('iPad'))
const hasInstagram = (userAgent: string) => userAgent.includes('Instagram')

export const universalLinksMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const userAgent = request.get('User-Agent') ?? ''
  const destinationHeader = request.get('Sec-Fetch-Dest') ?? '' // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest

  if (destinationHeader === 'document' && hasMobileIOS(userAgent) && hasInstagram(userAgent)) {
    const fullUrl = 'https://' + request.get('host') + request.originalUrl
    const url = new URL(fullUrl)
    response.redirect(`app.passculture.${env.ENV}://${url.pathname.substring(1)}${url.search}`)
  } else {
    next()
  }
}
