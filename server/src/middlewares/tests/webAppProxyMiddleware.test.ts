import { IncomingMessage, ServerResponse } from 'http'

import {
  OFFER_RESPONSE_SNAPSHOT,
  TEST_HTML,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
  VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT,
} from '../../../tests/constants'
import { env } from '../../libs/environment/env'
import { metasResponseInterceptor } from '../webAppProxyMiddleware'
import { server } from '../../../tests/server'

const responseBuffer = Buffer.from(TEST_HTML)
const req = {} as IncomingMessage
const res = {} as ServerResponse

const htmlResponseFor = async (url: string): Promise<string | Buffer> => {
  const proxyRes = {
    headers: {
      'content-type': 'text/html',
    },
  } as IncomingMessage

  return await metasResponseInterceptor(
    responseBuffer,
    proxyRes,
    {
      ...req,
      url,
    } as IncomingMessage,
    res
  )
}

const hasCanonicalWith = (href: string): RegExp => {
  const pattern = `<head>.*?<link rel="canonical" href="${href}" />.*?</head>`
  return new RegExp(pattern, 's')
}

describe('metasResponseInterceptor', () => {
  describe('with mock backend', () => {
    beforeAll(() => {
      server.listen()
    })

    afterAll(() => {
      server.resetHandlers()
      server.close()
    })

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
        const finalResponseBuffer = await htmlResponseFor(url)

        expect(finalResponseBuffer).not.toEqual(responseBuffer.toString('utf8'))
      }
    )

    describe('should add canonical link tag', () => {
      it.each(['/connexion', '/creation-compte'])('when url is %s', async (path) => {
        const url = `${env.APP_PUBLIC_URL}${path}`

        const response = await htmlResponseFor(url)

        expect(response).toMatch(hasCanonicalWith(url))
      })

      it.each(['/connexion', '/creation-compte'])(
        'without query params when url is %s with query params',
        async (path) => {
          const canonical = `${env.APP_PUBLIC_URL}${path}`

          const response = await htmlResponseFor(`${canonical}?truc=toto`)

          expect(response).toMatch(hasCanonicalWith(canonical))
        }
      )

      it.each([
        `/offre/${OFFER_RESPONSE_SNAPSHOT.id}`,
        `/lieu/${VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id}`,
        `/lieu/${VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT.id}`,
      ])('with id when url is %s', async (path) => {
        const url = `${env.APP_PUBLIC_URL}${path}`

        const response = await htmlResponseFor(url)

        expect(response).toMatch(hasCanonicalWith(url))
      })

      it("when using `yarn dev` we don't have the host", async () => {
        const response = await htmlResponseFor('/')

        expect(response).toMatch(hasCanonicalWith(`${env.APP_PUBLIC_URL}/`))
      })
    })
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
      const offerId = await getOfferId("C'est notre prooooojecteur")
      const url = `${env.APP_PUBLIC_URL}/offre/${offerId}`
      const html = await metasResponseInterceptor(
        responseBuffer,
        proxyRes,
        {
          ...req,
          url,
        } as IncomingMessage,
        res
      )

      const htmlWithoutOfferId = html
        .toString()
        .replaceAll(offerId, 'offerId')
        .replace(/(?<=mediations\/)[A-Z0-9_]+/, 'humanizedOfferId')

      expect(htmlWithoutOfferId).toMatchSnapshot()
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

type Hit = {
  objectID: string
  offer: {
    name?: string
  }
}

const getAlgoliaObjectId = async (index: string, query: string): Promise<Hit[]> => {
  const response = await fetch(
    `https://${ALGOLIA_APPLICATION_ID}-dsn.algolia.net/1/indexes/${index}/query`,
    {
      method: 'POST',
      headers: new Headers({
        'X-Algolia-API-Key': ALGOLIA_SEARCH_API_KEY,
        'X-Algolia-Application-Id': ALGOLIA_APPLICATION_ID,
      }),
      body: `{ "params": "query=${query}&hitsPerPage=10" }`,
    }
  )

  const hits = await response.json()

  return hits.hits
}

const firstObjectID = (hits: Hit[]): string => {
  const hit = hits.at(0)
  if (!hit) throw new Error("can't find Algolia result")
  return hit.objectID
}

const getOfferId = async (query: string): Promise<string> => {
  const hits = await getAlgoliaObjectId(ALGOLIA_OFFERS_INDEX_NAME, query)
  const hitsWithoutDataInName = hits.filter((hit) => hit.offer.name?.includes('DATA') === false)
  return firstObjectID(hitsWithoutDataInName)
}

const getVenueId = async (query: string): Promise<string> => {
  const hits = await getAlgoliaObjectId(ALGOLIA_VENUES_INDEX_NAME, query)
  return firstObjectID(hits)
}
