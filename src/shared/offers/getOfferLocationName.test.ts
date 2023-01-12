import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { renderHook } from 'tests/utils'

import { getOfferLocationName } from './getOfferLocationName'

describe('getOfferLocationName', () => {
  it('should return offerer name when is digital offer', () => {
    const isDigital = true
    const venue = offerVenueResponseSnap
    const { result } = renderHook(() => getOfferLocationName(venue, isDigital))

    expect(result.current).toEqual('Le Grand Rex')
  })

  describe('not digital offer', () => {
    const isDigital = false

    it('should return venue publicName when venue.publicName is defined', () => {
      const venue = {
        ...offerVenueResponseSnap,
        name: 'Le Grande Rex - name',
        publicName: 'Le Grande Rex - publicName',
      }
      const { result } = renderHook(() => getOfferLocationName(venue, isDigital))

      expect(result.current).toEqual('Le Grande Rex - publicName')
    })

    it('should return venue name when venue.publicName is undefined', () => {
      const venue = {
        ...offerVenueResponseSnap,
        name: 'Le Grande Rex - name',
        publicName: undefined,
      }
      const { result } = renderHook(() => getOfferLocationName(venue, isDigital))

      expect(result.current).toEqual('Le Grande Rex - name')
    })
  })
})
