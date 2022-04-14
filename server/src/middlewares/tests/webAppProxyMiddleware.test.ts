import { IncomingMessage } from 'http'

import {
  OFFER_RESPONSE_SNAP,
  TEST_HTML,
  VENUE_RESPONSE_SNAP,
  VENUE_RESPONSE_ALTERNATIVE_SNAP,
} from '../../../tests/constants'
import { env } from '../../libs/environment/env'
import { OFFER } from '../../services/entities/offer'
import { ENTITY_MAP } from '../../services/entities/types'
import { VENUE } from '../../services/entities/venue'
import { metasResponseInterceptor } from '../webAppProxyMiddleware'

describe('webAppProxyMiddleware', () => {
  const responseBuffer = Buffer.from(TEST_HTML)
  const proxyRes = {
    headers: {
      'content-type': 'text/html',
    },
  } as IncomingMessage
  const req = {} as IncomingMessage

  describe('metasResponseInterceptor', () => {
    it('should return unmodified response buffer when content-type is NOT text/html', async () => {
      const imagePngResponseBuffer = Buffer.from('I am an image/png')
      const notTextHtmlProxyRes = {
        headers: {
          'content-type': 'image/png',
        },
      } as IncomingMessage

      const unmodifiedResponseBuffer = await metasResponseInterceptor(
        imagePngResponseBuffer,
        notTextHtmlProxyRes,
        req
      )

      expect(imagePngResponseBuffer).toEqual(unmodifiedResponseBuffer)
    })

    it.each([
      ['true', OFFER.API_MODEL_NAME, 'offre', `${OFFER_RESPONSE_SNAP.id}`],
      ['true', VENUE.API_MODEL_NAME, 'lieu', `${VENUE_RESPONSE_SNAP.id}`],
      ['true', VENUE.API_MODEL_NAME, 'lieu', `${VENUE_RESPONSE_ALTERNATIVE_SNAP.id}`],
      ...Object.entries(ENTITY_MAP).map(([key, { API_MODEL_NAME }]) => [
        'false',
        API_MODEL_NAME,
        key,
        '',
      ]),
    ])(
      `should edit html=%s when req.url on %s use valid id: /%s/%s`,
      async (isEditedHtml: string, entity: string, endpoint: string, id: string) => {
        const url = `${env.APP_PUBLIC_URL}/${endpoint}${id ? `/${id}` : ''}`
        const finalResponseBuffer = await metasResponseInterceptor(responseBuffer, proxyRes, {
          ...req,
          url,
        } as IncomingMessage)

        expect(responseBuffer.toString('utf8') !== finalResponseBuffer).toBe(Boolean(isEditedHtml))
      }
    )
  })
})
