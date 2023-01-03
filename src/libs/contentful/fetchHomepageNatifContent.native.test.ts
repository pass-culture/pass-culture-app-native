import { rest } from 'msw'

import { homepageList } from 'features/home/fixtures/homepageList.fixtures'
import { fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'
import { BASE_URL, PARAMS } from 'libs/contentful/fetchHomepageNatifContent'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { server } from 'tests/server'

server.use(
  rest.get(`${BASE_URL}/entries/${PARAMS}`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
  })
)

describe('Contentful fetchHomepageNatifContent', () => {
  it('should retrieve a list of adapted homepages', async () => {
    const result = await fetchHomepageNatifContent()
    expect(result).toEqual(homepageList)
  })
})
