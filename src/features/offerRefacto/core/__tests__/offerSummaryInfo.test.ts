import mockdate from 'mockdate'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { getOfferSummaryInfoData } from 'features/offerRefacto/core'

mockdate.set(CURRENT_DATE)

describe('getOfferSummaryInfoData', () => {
  it('should return formatted offer summary data', () => {
    const offerSummaryInfoData = getOfferSummaryInfoData(offerResponseSnap)

    expect(offerSummaryInfoData).toEqual({
      addressLabel: 'PATHE BEAUGRENELLE',
      duration: undefined,
      formattedDate: 'Les 3 et 4 janvier 2021',
      fullAddressOffer: '2 RUE LAMENNAIS, 75008 PARIS 8',
      fullAddressVenue: '2 RUE LAMENNAIS, 75008 PARIS 8',
      isDigital: false,
      isDuo: true,
      locationName: 'PATHE BEAUGRENELLE',
    })
  })

  it('should formatted duration offer summary data when duration is provided', () => {
    const offerSummaryInfoData = getOfferSummaryInfoData({
      ...offerResponseSnap,
      extraData: { durationMinutes: 125 },
    })

    expect(offerSummaryInfoData.duration).toEqual('2h05')
  })
})
