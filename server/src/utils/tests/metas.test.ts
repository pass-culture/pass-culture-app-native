import { OFFER_RESPONSE_SNAP, TEST_HTML, VENUE_RESPONSE_SNAP } from '../../../tests/constants'
import { ENTITY_MAP, EntityKeys } from '../../services/entities/types'
import { replaceHtmlMetas } from '../metas'

const mockEntityMap = ENTITY_MAP
const mockOfferResponse = OFFER_RESPONSE_SNAP
const mockVenueResponse = VENUE_RESPONSE_SNAP

jest.mock('../../services/apiClient', () => ({
  apiClient: async (type: EntityKeys) => {
    if (mockEntityMap[type].API_MODEL_NAME === 'offer') {
      return mockOfferResponse
    } else if (mockEntityMap[type].API_MODEL_NAME === 'venue') {
      return mockVenueResponse
    }
    throw new Error(`Unknown entity: ${type}`)
  },
}))

describe('metas utils', () => {
  it(`should replace meta for offer`, async () => {
    const newHtml = await replaceHtmlMetas(
      TEST_HTML,
      `/offre/${OFFER_RESPONSE_SNAP.id}`,
      'offre' as EntityKeys,
      OFFER_RESPONSE_SNAP.id
    )
    expect(newHtml).toMatchSnapshot()
  })

  it(`should replace meta for venue`, async () => {
    const newHtml = await replaceHtmlMetas(
      TEST_HTML,
      `/lieu/${VENUE_RESPONSE_SNAP.id}`,
      'lieu' as EntityKeys,
      VENUE_RESPONSE_SNAP.id
    )
    expect(newHtml).toMatchSnapshot()
  })
})
