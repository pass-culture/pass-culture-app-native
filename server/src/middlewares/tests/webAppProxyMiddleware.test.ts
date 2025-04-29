import { IncomingMessage, ServerResponse } from 'http'
import { Request } from 'express'
import {
  OFFER_RESPONSE_SNAPSHOT,
  TEST_HTML,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
  VENUE_WITHOUT_BANNER_RESPONSE_SNAPSHOT,
} from '../../../tests/constants'
import { env } from '../../libs/environment/env'
import { metasResponseInterceptor, fixHTMLFallbackStatusCode } from '../webAppProxyMiddleware'
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

    it('should set cache-control public,no-cache and return unmodified response buffer when content-type is text/html and req.url end with .js', async () => {
      const jsResponseBuffer = Buffer.from('var foo = "bar"')
      const proxyRes = {
        headers: {
          'content-type': 'text/html',
        },
      } as IncomingMessage
      const setHeader = jest.fn()
      const unmodifiedResponseBuffer = await metasResponseInterceptor(
        jsResponseBuffer,
        proxyRes,
        {
          path: 'static/js/main.abcdef.chunk.js',
        } as Request,
        {
          setHeader,
        } as any
      )
      expect(setHeader).toBeCalledWith('Cache-Control', 'public,no-cache')
      expect(unmodifiedResponseBuffer).toEqual(jsResponseBuffer)
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

      it('with home id when url is thematic home', async () => {
        const url = `${env.APP_PUBLIC_URL}/accueil-thematique?homeId=1324434`
        const canonicalUrl = new RegExp(
          `<head>.*?<link rel="canonical" href="${env.APP_PUBLIC_URL}/accueil-thematique\\?homeId=1324434" />.*?</head>`,
          's'
        )

        const response = await htmlResponseFor(url)

        expect(response).toMatch(canonicalUrl)
      })

      it('with encoded home id when url is thematic home', async () => {
        const url = `${env.APP_PUBLIC_URL}/accueil-thematique?homeId=1324434"><script>alert('hack')</script>`
        const canonicalUrl = new RegExp(
          `<head>.*?<link rel="canonical" href="${env.APP_PUBLIC_URL}/accueil-thematique\\?homeId=1324434%22%3E%3Cscript%3Ealert\\(%27hack%27\\)%3C%2Fscript%3E\" />.*?</head>`,
          's'
        )

        const response = await htmlResponseFor(url)

        expect(response).toMatch(canonicalUrl)
      })

      it("when using `yarn dev` we don't have the host", async () => {
        const response = await htmlResponseFor('/')

        expect(response).toMatch(hasCanonicalWith(`${env.APP_PUBLIC_URL}/`))
      })

      it.each(['/recherche?query=%22test%22&view=%22Results%22', '/recherche?date=null'])(
        'should add noindex tag to search page with paramters %s',
        async (path) => {
          const url = `${env.APP_PUBLIC_URL}${path}`

          const response = await htmlResponseFor(url)

          expect(response).toContain('<meta name="robots" content="noindex" />')
        }
      )

      it('should index search landing page', async () => {
        const url = `${env.APP_PUBLIC_URL}/recherche`

        const response = await htmlResponseFor(url)

        expect(response).not.toContain('<meta name="robots" content="noindex" />')
      })

      it.each(['/recherche/filtres', '/recherche/filtres?query=%22test%22&view=%22Results%22'])(
        'should index search filter page %s',
        async (path) => {
          const url = `${env.APP_PUBLIC_URL}${path}`

          const response = await htmlResponseFor(url)

          expect(response).not.toContain('<meta name="robots" content="noindex" />')
        }
      )

      it('links offer description page to its offer page', async () => {
        const url = `${env.APP_PUBLIC_URL}/offre/${OFFER_RESPONSE_SNAPSHOT.id}`

        const response = await htmlResponseFor(`${url}/description`)

        expect(response).toMatch(hasCanonicalWith(url))
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

    it.skip('should request the real testing backend and get the offer data', async () => {
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

      const domParser = new DOMParser()
      const document = domParser.parseFromString(html.toString(), 'text/html')
      const metadataScript = document.querySelector('[type=application/ld+json]')
      const metadata = JSON.parse(metadataScript?.innerHTML || '{}')
      const metaKeywordsContent = document.querySelector('[name=keywords]')?.getAttribute('content')

      expect(metadata['@context']).toEqual('https://schema.org')
      expect(metadata['@type']).toEqual('Event')
      expect(metadata.name).toEqual('Atelier danses urbaines')
      expect(metadata.description).toEqual(
        'Les danseurs de tout style et de tout niveau, mais aussi tous les curieux, sont invités à participer à cet atelier conçu comme un moment de partage et animé par un danseur professionnel et un dj.'
      )
      expect(metadata.image).toEqual(
        'https://storage.googleapis.com/passculture-metier-ehp-staging-assets-fine-grained/thumbs/mediations/HE'
      )
      expect(metadata.startDate).toEqual('2018-05-19T14:00')
      expect(metadata.offers['@type']).toEqual('AggregateOffer')
      expect(metadata.offers.lowPrice).toEqual('0.00')
      expect(metadata.offers.priceCurrency).toEqual('EUR')
      expect(metadata.location['@type']).toEqual('Place')
      expect(metadata.location.name).toEqual('Le Centquatre-Paris')
      expect(metadata.location.address['@type']).toEqual('PostalAddress')
      expect(metadata.location.address.streetAddress).toEqual('5 Rue Curial')
      expect(metadata.location.address.postalCode).toEqual('75019')
      expect(metadata.location.address.addressLocality).toEqual('Paris')
      expect(metadata.location.geo['@type']).toEqual('GeoCoordinates')
      expect(metadata.location.geo.latitude).toEqual('48.88998')
      expect(metadata.location.geo.longitude).toEqual('2.37151')
      expect(metaKeywordsContent).toEqual('ATELIER PRATIQUE ART')
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

  describe('fixHTMLFallbackStatusCode', () => {
    it('should return 200 instead of 404', () => {
      expect(
        fixHTMLFallbackStatusCode(
          { headers: {} } as IncomingMessage,
          { statusCode: 404 } as IncomingMessage
        )
      ).toEqual(200)
    })

    it('should return 206 when Range header is set and backend responds with 206', () => {
      expect(
        fixHTMLFallbackStatusCode(
          { headers: { range: 'bytes=0-10' } } as IncomingMessage,
          { statusCode: 206 } as IncomingMessage
        )
      ).toEqual(206)
    })

    it('should return 404 when Range header is set and backend responds with 404', () => {
      expect(
        fixHTMLFallbackStatusCode(
          { headers: { range: 'bytes=0-10' } } as IncomingMessage,
          { statusCode: 404 } as IncomingMessage
        )
      ).toEqual(404)
    })

    it('should return 304 when If-Modified-Since is set and backend responds with 304', () => {
      expect(
        fixHTMLFallbackStatusCode(
          {
            headers: { 'if-modified-since': 'If-Modified-Since: Tue, 14 May 2024 18:28:00 GMT' },
          } as IncomingMessage,
          { statusCode: 304 } as IncomingMessage
        )
      ).toEqual(304)
    })
  })
})
