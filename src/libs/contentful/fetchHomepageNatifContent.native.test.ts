import { rest } from 'msw'

import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { fetchHomepageNatifContent } from 'libs/contentful/fetchHomepageNatifContent'
import { BASE_URL, PARAMS } from 'libs/contentful/fetchHomepageNatifContent'
import { homepageNatifEntryFixture } from 'libs/contentful/fixtures/homepageNatifEntry.fixture'
import { server } from 'tests/server'

server.use(
  rest.get(`${BASE_URL}/entries/${PARAMS}`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageNatifEntryFixture))
  })
)

describe('Contentful fetchHomepageNatifContent', () => {
  //TODO(EveJulliard): fix this test
  it.skip('should ', async () => {
    const result = await fetchHomepageNatifContent()
    expect(result).toEqual(adaptedHomepage)
  })
})
