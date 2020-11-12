import { rest } from 'msw'

import { env } from 'libs/environment'
import { homepageEntriesAPIResponse, adaptedHomepageEntries } from 'tests/fixtures/homepageEntries'
import { server } from 'tests/server'

import { getHomepageEntries, CONTENTFUL_BASE_URL } from './api'

server.use(
  rest.get(
    `${CONTENTFUL_BASE_URL}/spaces/${env.CONTENTFUL_SPACE_ID}/environments/${env.CONTENTFUL_ENVIRONMENT}/entries?include=2&content_type=homepageNatif&access_token=${env.CONTENTFUL_ACCESS_TOKEN}`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
    }
  )
)

describe('Home api calls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('getHomepageEntries', async () => {
    const result = await getHomepageEntries()
    expect(result).toEqual(adaptedHomepageEntries)
  })
})
