import { OFFER_RESPONSE_SNAP, TEST_HTML, VENUE_RESPONSE_SNAP } from '../../../tests/constants'
import { OFFER } from '../../services/entities/offer'
import { ENTITY_MAP, EntityKeys } from '../../services/entities/types'
import { VENUE } from '../../services/entities/venue'
import { replaceHtmlMetas } from '../metas'

const mockOfferMetasConfig = OFFER
const mockVenuMetasConfig = VENUE
const mockEntityMap = ENTITY_MAP
const mockOfferResponse = OFFER_RESPONSE_SNAP
const mockVenueResponse = VENUE_RESPONSE_SNAP

jest.mock('../../services/apiClient', () => ({
  apiClient: async (type: EntityKeys) => {
    if (mockEntityMap[type].API_MODEL_NAME === mockOfferMetasConfig.API_MODEL_NAME) {
      return mockOfferResponse
    } else if (mockEntityMap[type].API_MODEL_NAME === mockVenuMetasConfig.API_MODEL_NAME) {
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
