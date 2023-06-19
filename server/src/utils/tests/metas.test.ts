import {
  OFFER_RESPONSE_SNAPSHOT,
  TEST_HTML,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
} from '../../../tests/constants'
import { ENTITY_MAP, EntityKeys } from '../../services/entities/types'
import { replaceHtmlMetas, addOrganizationPrefix } from '../metas'
import { env } from '../../libs/environment/env'

const mockEntityMap = ENTITY_MAP
const mockOfferResponse = OFFER_RESPONSE_SNAPSHOT
const mockVenueResponse = VENUE_WITH_BANNER_RESPONSE_SNAPSHOT

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
      `/offre/${OFFER_RESPONSE_SNAPSHOT.id}`,
      'offre' as EntityKeys,
      OFFER_RESPONSE_SNAPSHOT.id
    )
    expect(newHtml).toMatchSnapshot()
  })

  it(`should replace meta for venue`, async () => {
    const newHtml = await replaceHtmlMetas(
      TEST_HTML,
      `/lieu/${VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id}`,
      'lieu' as EntityKeys,
      VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id
    )
    expect(newHtml).toMatchSnapshot()
  })

  it(`should prefix string "Hello World" with "${env.ORGANIZATION_PREFIX} |"`, () => {
    expect(addOrganizationPrefix('Hello World')).toEqual(`${env.ORGANIZATION_PREFIX} | Hello World`)
  })
})
