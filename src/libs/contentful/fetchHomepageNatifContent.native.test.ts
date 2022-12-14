import { rest } from 'msw'

import { fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'
import { BASE_URL, PARAMS } from 'libs/contentful/fetchHomepageNatifContent'
import { adaptedHomepageEntry } from 'tests/fixtures/adaptedHomepageEntry'
import { adaptedSecondHomepageEntry } from 'tests/fixtures/adaptedSecondHomepageEntry'
import { homepageEntriesAPIResponse } from 'tests/fixtures/homepageEntriesAPIResponse'
import { server } from 'tests/server'

server.use(
  rest.get(`${BASE_URL}/entries/${PARAMS}`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
  })
)

describe('Contentful fetchHomepageNatifContent', () => {
  it('should ', async () => {
    const result = await fetchHomepageNatifContent()
    expect(result[0]).toEqual(adaptedHomepageEntry)
    expect(result[1]).toEqual(adaptedSecondHomepageEntry)
  })
})
