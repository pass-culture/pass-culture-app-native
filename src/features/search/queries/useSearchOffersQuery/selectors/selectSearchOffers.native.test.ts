import { InfiniteData } from '@tanstack/react-query'

import { SubcategoryIdEnum } from 'api/gen'
import { FetchSearchOffersResponse } from 'features/search/queries/useSearchOffersQuery/types'
import { AlgoliaOffer, HitOffer } from 'libs/algolia/types'

import { selectSearchOffers } from './selectSearchOffers'

const transformHits = (hit: AlgoliaOffer<HitOffer>) => hit

const makePage = (offersOverrides = {}, duplicatedOverrides = {}): FetchSearchOffersResponse => ({
  offersResponse: {
    hits: [],
    nbHits: 0,
    userData: null,
    nbPages: 1,
    page: 0,
    ...offersOverrides,
  },
  duplicatedOffersResponse: {
    hits: [],
    nbHits: 0,
    ...duplicatedOverrides,
  },
})

const makeData = (pages: FetchSearchOffersResponse[]): InfiniteData<FetchSearchOffersResponse> => ({
  pages,
  pageParams: [],
})

describe('selectSearchOffers', () => {
  it('should return all expected keys', () => {
    const data = makeData([makePage()])
    const result = selectSearchOffers({ data, transformHits })

    expect(result).toEqual(
      expect.objectContaining({
        duplicatedOffers: expect.any(Array),
        lastPage: expect.objectContaining({
          duplicatedOffersResponse: expect.objectContaining({
            hits: expect.any(Array),
            nbHits: 0,
          }),
          offersResponse: expect.objectContaining({
            hits: expect.any(Array),
            nbHits: 0,
            nbPages: 1,
            page: 0,
            userData: null,
          }),
        }),
        nbHits: 0,
        offerVenues: expect.any(Array),
        offers: expect.any(Array),
        userData: null,
      })
    )
  })

  const mockOffer: AlgoliaOffer<HitOffer> = {
    objectID: '1',
    offer: {
      dates: [],
      isDuo: false,
      isDigital: false,
      name: 'Bellatrix Tome 1',
      prices: [14.95],
      subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
      thumbUrl: '',
    },
    venue: {
      id: 1,
      name: 'Lieu 1',
      publicName: 'Lieu 1',
      address: '1 rue de la paix',
      postalCode: '75000',
      city: 'Paris',
      activity: 'BOOKSTORE',
      isPermanent: true,
    },
    _geoloc: { lat: 48.94374, lng: 2.48171 },
  }
  const data = makeData([makePage({ hits: [mockOffer], nbHits: 1 }, { hits: [mockOffer] })])

  it('should return offers', () => {
    const result = selectSearchOffers({ data, transformHits })

    expect(result.offers).toHaveLength(1)
  })
})
