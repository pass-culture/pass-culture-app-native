import { headlineOfferData } from 'features/headlineOffer/adapters/headlineOfferData'
import { mockLabelMapping, mockMapping } from 'features/headlineOffer/fixtures/mockMapping'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { offersFixture } from 'shared/offer/offer.fixture'

describe('headlineOfferData', () => {
  it('should transform headline offer data correctly', () => {
    const result = headlineOfferData({
      offer: offersFixture[0],
      mapping: mockMapping,
      labelMapping: mockLabelMapping,
      currency: Currency.EURO,
      euroToPacificFrancRate: 10,
      userLocation: { latitude: 1, longitude: 1 },
    })

    expect(result).toEqual({
      id: '102280',
      categoryId: 'LIVRE',
      category: 'Livre papier',
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDNQ',
      offerTitle: 'La nuit des temps',
      price: 'Dès 28\u00a0€',
      distance: '900+ km',
    })
  })
})
