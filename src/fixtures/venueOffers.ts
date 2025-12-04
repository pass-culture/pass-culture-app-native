import { Activity, SubcategoryIdEnum } from 'api/gen'
import { AlgoliaOffer, MultipleVenueOffersResult } from 'libs/algolia/types'

export const mockedAlgoliaOffer: AlgoliaOffer = {
  offer: {
    dates: [
      1761519600, 1761541200, 1761562800, 1761606000, 1761627600, 1761649200, 1761692400,
      1761714000, 1761735600, 1761778800, 1761800400, 1761822000, 1761865200, 1761886800,
      1761908400, 1762653600,
    ],
    isDuo: true,
    isEducational: false,
    name: 'FILM NOUVELLE CALEDONIE',
    prices: [4.95],
    subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
    thumbUrl: '/passculture-metier-ehp-staging-assets-fine-grained/thumbs/mediations/4LWZ2',
  },
  venue: {
    address: '18 Rue de la Somme',
    banner_url:
      'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/venues/QZ5A_1721659486',
    city: 'Nouméa',
    departmentCode: '988',
    id: 34426,
    isAudioDisabilityCompliant: true,
    isMentalDisabilityCompliant: false,
    isMotorDisabilityCompliant: true,
    isPermanent: true,
    isVisualDisabilityCompliant: true,
    name: 'UGC CINE CITE LES HALLES',
    postalCode: '98800',
    publicName: 'UGC CINE CITE LES HALLES',
    activity: Activity.CINEMA,
  },
  _geoloc: {
    lat: -22.27368,
    lng: 166.4402,
  },
  objectID: '348439787',
}

export const mockedMultipleVenueOffers: MultipleVenueOffersResult = [
  {
    hits: [mockedAlgoliaOffer],
    nbHits: 1,
  },
  { hits: [], nbHits: 0 },
  { hits: [], nbHits: 0 },
]
