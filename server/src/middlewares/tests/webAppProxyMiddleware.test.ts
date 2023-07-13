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
      async (_entity: string, endpoint: string, id: string) => {
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
    // we use the staging backend to ensure that the offer/venue data is not changing at every sandbox reset
    const originalApiBaseUrl = env.API_BASE_URL
    beforeAll(() => {
      env.API_BASE_URL = 'https://backend.staging.passculture.team'
    })
    afterAll(() => {
      env.API_BASE_URL = originalApiBaseUrl
    })

    const responseBuffer = Buffer.from(TEST_HTML)
    const proxyRes = {
      headers: {
        'content-type': 'text/html',
      },
    } as IncomingMessage
    const req = {} as IncomingMessage
    const res = {} as ServerResponse

    it('should request the real testing backend and get the offer data', async () => {
      const url = `${env.APP_PUBLIC_URL}/offre/1`
      const html = await metasResponseInterceptor(
        responseBuffer,
        proxyRes,
        {
          ...req,
          url,
        } as IncomingMessage,
        res
      )

      const htmlWithoutOfferId = html.toString()

      expect(htmlWithoutOfferId).toMatchSnapshot()
    })

    it('should request the real testing backend and get the venue data', async () => {
      const url = `${env.APP_PUBLIC_URL}/lieu/9` // 9 is the id of the first permanent venue in the staging database
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
