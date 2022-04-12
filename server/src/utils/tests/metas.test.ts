import { replaceHtmlMetas } from '../metas'
import { ENTITY_MAP, EntityKeys } from '../../services/entities/types'
import { OFFER_RESPONSE_SNAP, TEST_HTML, VENUE_RESPONSE_SNAP } from '../../../tests/constants'
import { OFFER } from '../../services/entities/offer'
import { VENUE } from '../../services/entities/venue'

const mockOfferMetasConfig = OFFER
const mockVenuMetasConfig = VENUE
const mockEntityMap = ENTITY_MAP
const mockOfferResponse = OFFER_RESPONSE_SNAP
const mockVenueResponse = VENUE_RESPONSE_SNAP

jest.mock('../../services/apiClient', () => ({
  apiClient: async (type: EntityKeys) => {
    const selectedType = mockEntityMap[type as EntityKeys]
    if(selectedType.NAME === mockOfferMetasConfig.NAME) {
      return mockOfferResponse
    } else if (selectedType.NAME === mockVenuMetasConfig.NAME) {
      return mockVenueResponse
    }
  }
}))

describe('metas utils', () => {
  it(`should replace meta for offer`, async () => {
    const newHtml = await replaceHtmlMetas(TEST_HTML, `/offre/${OFFER_RESPONSE_SNAP.id}`, 'offre' as EntityKeys, OFFER_RESPONSE_SNAP.id)
    expect(newHtml).toMatchSnapshot()
  })

  it(`should replace meta for venue`, async () => {
    const newHtml = await replaceHtmlMetas(TEST_HTML, `/lieu/${VENUE_RESPONSE_SNAP.id}`, 'lieu' as EntityKeys, VENUE_RESPONSE_SNAP.id)
    expect(newHtml).toMatchSnapshot()
  })
})
