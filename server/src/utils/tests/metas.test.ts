import {
  OFFER_RESPONSE_SNAPSHOT,
  OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA,
  TEST_HTML,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
} from '../../../tests/constants'
import { ENTITY_MAP, EntityKeys } from '../../services/entities/types'
import { replaceHtmlMetas, addOrganizationPrefix } from '../metas'
import { env } from '../../libs/environment/env'

const mockEntityMap = ENTITY_MAP
const mockOfferResponse = OFFER_RESPONSE_SNAPSHOT
const mockOfferResponseWithDangerousMetadata = OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA
const mockVenueResponse = VENUE_WITH_BANNER_RESPONSE_SNAPSHOT

jest.mock('../../services/apiClient', () => ({
  apiClient: async (type: EntityKeys, id: number) => {
    if (mockEntityMap[type].API_MODEL_NAME === 'offer') {
      if (id === mockOfferResponseWithDangerousMetadata.id) {
        return mockOfferResponseWithDangerousMetadata
      }
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

  it('should encode metadata in json-ld', async () => {
    const html = await replaceHtmlMetas(
      TEST_HTML,
      `/offre/${OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA.id}`,
      'offre' as EntityKeys,
      OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA.id
    )

    expect(html).toContain(
      '&lt;/script&gt;&lt;script&gt;alert(&quot;you have been pwned&quot;)&lt;/script&gt;'
    )
  })

  it('should encode metadata in json-ld recursively', async () => {
    const html = await replaceHtmlMetas(
      TEST_HTML,
      `/offre/${OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA.id}`,
      'offre' as EntityKeys,
      OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA.id
    )

    expect(html).toContain(
      '&lt;/script&gt;&lt;script&gt;alert(&quot;you have been hacked&quot;)&lt;/script&gt;'
    )
  })

  it('should encode metadata in meta tags', async () => {
    const html = await replaceHtmlMetas(
      TEST_HTML,
      `/offre/${OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA.id}`,
      'offre' as EntityKeys,
      OFFER_RESPONSE_SNAPSHOT_WITH_DANGEROUS_METADATA.id
    )

    expect(html).toContain(
      '&lt;/script&gt;&lt;script&gt;alert(&quot;you have been pranked&quot;)&lt;/script&gt;'
    )
  })
})
