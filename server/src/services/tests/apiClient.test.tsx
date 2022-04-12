import { apiClient } from '../apiClient'
import { OFFER_RESPONSE_SNAP, VENUE_RESPONSE_SNAP } from '../../../tests/constants'
import { EntityKeys } from '../entities/types'

describe('apiClient', () => {
  it(`should get offer ${OFFER_RESPONSE_SNAP.id}`, async () => {
    const offer = await apiClient('offre', OFFER_RESPONSE_SNAP.id)
    expect(offer).toEqual(OFFER_RESPONSE_SNAP)
  })

  it(`should get venue ${VENUE_RESPONSE_SNAP.id}`, async () => {
    const offer = await apiClient('lieu', VENUE_RESPONSE_SNAP.id)
    expect(offer).toEqual(VENUE_RESPONSE_SNAP)
  })

  it('should throw error with wrong entity type', async () => {
    const wrongEntityType = 'settings' as EntityKeys
    await expect(async () => await apiClient(wrongEntityType, 0)).rejects.toThrowError(new Error(`Unknown entity: ${wrongEntityType}`))
  })

  it( `should throw error when status code is 404 instead of 200`, async () => {
    await expect(async () => await apiClient('offre', 0)).rejects.toThrowError(new Error(`Wrong status code: 404`))
  })
})
