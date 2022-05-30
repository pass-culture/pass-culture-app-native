import { IncomingMessage, ServerResponse } from 'http'

import {
  OFFER_RESPONSE_SNAPSHOT,
  TEST_HTML,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
  VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT,
} from '../../../tests/constants'
import { env } from '../../libs/environment/env'
import { ENTITY_MAP } from '../../services/entities/types'
import { metasResponseInterceptor } from '../webAppProxyMiddleware'
import { server } from '../../../tests/server'

describe('webAppProxyMiddleware', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.resetHandlers()
    server.close()
  })

  const responseBuffer = Buffer.from(TEST_HTML)
  const proxyRes = {
    headers: {
      'content-type': 'text/html',
    },
  } as IncomingMessage
  const req = {} as IncomingMessage
  const res = {} as ServerResponse

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
        req,
        res
      )

      expect(unmodifiedResponseBuffer).toEqual(imagePngResponseBuffer)
    })

    it.each([
      ['offer', 'offre', `${OFFER_RESPONSE_SNAPSHOT.id}`],
      ['venue', 'lieu', `${VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id}`],
      ['venue', 'lieu', `${VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT.id}`],
    ])(
      `should edit html when req.url on %s use valid id: /%s/%s`,
      async (entity: string, endpoint: string, id: string) => {
        const url = `${env.APP_PUBLIC_URL}/${endpoint}${id ? `/${id}` : ''}`
        const finalResponseBuffer = await metasResponseInterceptor(responseBuffer, proxyRes, {
          ...req,
          url,
        } as IncomingMessage, res)

        expect(finalResponseBuffer).not.toEqual(responseBuffer.toString('utf8'))
      }
    )

    it.each(
      Object.entries(ENTITY_MAP).map(([key, { API_MODEL_NAME }]) => [API_MODEL_NAME, key])
    )(
      `should not edit html when req.url on %s use valid id: /%s`,
      async (entity: string, endpoint: string) => {
        const url = `${env.APP_PUBLIC_URL}/${endpoint}`
        const finalResponseBuffer = await metasResponseInterceptor(responseBuffer, proxyRes, {
          ...req,
          url,
        } as IncomingMessage, res)

        expect(finalResponseBuffer).toEqual(responseBuffer.toString('utf8'))
      }
    )
  })
})
