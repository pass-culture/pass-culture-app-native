import { OFFER_RESPONSE_SNAPSHOT, VENUE_WITH_BANNER_RESPONSE_SNAPSHOT } from '../../../tests/constants'
import { apiClient } from '../apiClient'
import { EntityKeys } from '../entities/types'
import { server } from '../../../tests/server'

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
    await expect(async () => await apiClient(wrongEntityType, 0)).rejects.toThrowError(
      new Error(`Unknown entity: ${wrongEntityType}`)
    )
  })

  it(`should throw error when HTTP status code is not 200`, async () => {
    await expect(async () => await apiClient('offre', 0)).rejects.toThrowError(
      new Error(`Wrong status code: 404`)
    )
  })
})
