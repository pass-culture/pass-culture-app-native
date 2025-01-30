import { CategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { headlineOfferData } from 'features/headlineOffer/adapters/headlineOfferData'
import { CategoryHomeLabelMapping, CategoryIdMapping } from 'libs/subcategories/types'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { offersFixture } from 'shared/offer/offer.fixture'

const mockMapping = {
  LIVRE_PAPIER: CategoryIdEnum.LIVRE,
  SEANCE_CINE: CategoryIdEnum.CINEMA,
} as CategoryIdMapping

const mockLabelMapping = {
  [SubcategoryIdEnumv2.SEANCE_CINE]: 'Séance de cinéma',
  [SubcategoryIdEnumv2.LIVRE_PAPIER]: 'Livre papier',
} as CategoryHomeLabelMapping

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
      coordinates: '900+ km',
    })
  })
})
