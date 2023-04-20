import { SubcategoryIdEnum } from 'api/gen'
import { Offer } from 'shared/offer/types'

export const offersFixture: Offer[] = [
  {
    _geoloc: { lat: 48.87004, lng: 2.3785 },
    objectID: '13715',
    offer: {
      dates: [1682539200],
      isDigital: false,
      isDuo: true,
      isEducational: false,
      name: 'Punk sous un cathodique',
      prices: [800],
      subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      thumbUrl: '/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/DBUQ_1',
    },
  },
  {
    _geoloc: { lat: null, lng: null },
    objectID: '13848',
    offer: {
      dates: [],
      isDigital: true,
      isDuo: false,
      isEducational: false,
      name: 'Product 501',
      prices: [8130, 1995000],
      subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_FILM,
      thumbUrl: '/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/DBUQ_1',
    },
  },
]
