import { offerVenueResponseSnap } from 'features/offer/fixtures/offerVenueReponse'
import { getFormattedAddress } from 'features/offer/helpers/getFormattedAddress/getFormattedAddress'

describe('getFormattedAddress', () => {
  it('returns formatted address with venue banner', () => {
    const showVenueBanner = true
    const result = getFormattedAddress(offerVenueResponseSnap, showVenueBanner)

    expect(result).toEqual('1 boulevard Poissonnière, 75000 Paris')
  })

  it('returns formatted address with venue name', () => {
    const showVenueBanner = false
    const result = getFormattedAddress(offerVenueResponseSnap, showVenueBanner)

    expect(result).toEqual('Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris')
  })
})
