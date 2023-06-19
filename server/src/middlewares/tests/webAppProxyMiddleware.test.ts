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

describe('metasResponseInterceptor', () => {
  describe('with mock backend', () => {
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
        const finalResponseBuffer = await metasResponseInterceptor(
          responseBuffer,
          proxyRes,
          {
            ...req,
            url,
          } as IncomingMessage,
          res
        )

        expect(finalResponseBuffer).not.toEqual(responseBuffer.toString('utf8'))
      }
    )

    it.each(Object.entries(ENTITY_MAP).map(([key, { API_MODEL_NAME }]) => [API_MODEL_NAME, key]))(
      `should not edit html when req.url on %s use valid id: /%s`,
      async (entity: string, endpoint: string) => {
        const url = `${env.APP_PUBLIC_URL}/${endpoint}`
        const finalResponseBuffer = await metasResponseInterceptor(
          responseBuffer,
          proxyRes,
          {
            ...req,
            url,
          } as IncomingMessage,
          res
        )

        expect(finalResponseBuffer).toEqual(responseBuffer.toString('utf8'))
      }
    )
  })

  describe('with real backend', () => {
    const responseBuffer = Buffer.from(TEST_HTML)
    const proxyRes = {
      headers: {
        'content-type': 'text/html',
      },
    } as IncomingMessage
    const req = {} as IncomingMessage
    const res = {} as ServerResponse

    it('should request the real testing backend and get the offer data', async () => {
      const offerId = await getOfferId('Punk sous un cathodique')
      const url = `${env.APP_PUBLIC_URL}/offre/${offerId}`
      const finalResponseBuffer = await metasResponseInterceptor(
        responseBuffer,
        proxyRes,
        {
          ...req,
          url,
        } as IncomingMessage,
        res
      )

      expect(finalResponseBuffer).toMatchSnapshot()
    })

    it('should request the real testing backend and get the venue data', async () => {
      const venueId = await getVenueId('Terrain vague')
      const url = `${env.APP_PUBLIC_URL}/lieu/${venueId}`
      const finalResponseBuffer = await metasResponseInterceptor(
        responseBuffer,
        proxyRes,
        {
          ...req,
          url,
        } as IncomingMessage,
        res
      )

      expect(finalResponseBuffer).toMatchSnapshot()
    })
  })
})

const ALGOLIA_APPLICATION_ID = 'testingHXXTDUE7H0' // This is your unique application identifier. It's used to identify you when using Algolia's API.
const ALGOLIA_OFFERS_INDEX_NAME = 'TESTING'
const ALGOLIA_VENUES_INDEX_NAME = 'testing-venues'
const ALGOLIA_SEARCH_API_KEY = '468f53ae703ee7ff219106f3d9a39e7f' //This is the public API key which can be safely used in your frontend code.This key is usable for search queries and it's also able to list the indices you've got access to.

const getAlgoliaObjectId = async (index: string, query: string): Promise<string> => {
  const response = await fetch(
    `https://${ALGOLIA_APPLICATION_ID}-dsn.algolia.net/1/indexes/${index}/query`,
    {
      method: 'POST',
      headers: new Headers({
        'X-Algolia-API-Key': ALGOLIA_SEARCH_API_KEY,
        'X-Algolia-Application-Id': ALGOLIA_APPLICATION_ID,
      }),
      body: `{ "params": "query=${query}&hitsPerPage=1&getRankingInfo=1" }`,
    }
  )

  const hits = await response.json()

  return hits.hits.at(0)?.objectID
}

const getOfferId = async (query: string): Promise<string> =>
  getAlgoliaObjectId(ALGOLIA_OFFERS_INDEX_NAME, query)

const getVenueId = async (query: string): Promise<string> =>
  getAlgoliaObjectId(ALGOLIA_VENUES_INDEX_NAME, query)
