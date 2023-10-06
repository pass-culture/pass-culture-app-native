import {
  OFFER_RESPONSE_SNAPSHOT,
  VENUE_WITH_BANNER_RESPONSE_SNAPSHOT,
} from '../../../tests/constants'
import { server } from '../../../tests/server'
import { apiClient } from '../apiClient'
import { EntityKeys } from '../entities/types'

describe('apiClient', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.resetHandlers()
    server.close()
  })

  it(`should get offer ${OFFER_RESPONSE_SNAPSHOT.id}`, async () => {
    const offer = await apiClient('offre', OFFER_RESPONSE_SNAPSHOT.id)
    expect(offer).toEqual(OFFER_RESPONSE_SNAPSHOT)
  })

  it(`should get venue ${VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id}`, async () => {
    const offer = await apiClient('lieu', VENUE_WITH_BANNER_RESPONSE_SNAPSHOT.id)
    expect(offer).toEqual(VENUE_WITH_BANNER_RESPONSE_SNAPSHOT)
  })

  it('should throw error with wrong entity type', async () => {
    const wrongEntityType = 'settings' as EntityKeys
    await expect(apiClient(wrongEntityType, 0)).rejects.toThrowError(
      new Error(`Unknown entity: ${wrongEntityType}`)
    )
  })

  it(`should return 200 and empty object when HTTP status code is 404`, async () => {
    await expect(apiClient('offre', 0)).resolves.toEqual({})
  })

  it(`should throw error when HTTP status code is not 200`, async () => {
    await expect(apiClient('offre', 502)).rejects.toThrowError(new Error(`Wrong status code: 502`))
  })
})
