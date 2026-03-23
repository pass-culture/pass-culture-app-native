import { InfiniteData } from '@tanstack/react-query'

import { FetchSearchOffersResponse } from 'features/search/queries/useSearchOffersQuery/types'
import { AlgoliaOffer, HitOffer } from 'libs/algolia/types'

import { selectSearchOffers } from './selectSearchOffers'

const transformHits = (hit: AlgoliaOffer<HitOffer>) => hit

describe('selectSearchOffers', () => {
  it('should flatten and transform offers and duplicated offers', () => {
    const mockData = {
      pages: [
        {
          offersResponse: {
            hits: [{ id: 'offer-1' }],
            nbHits: 100,
            userData: [{ message: 'user-data message' }],
          },
          duplicatedOffersResponse: {
            hits: [{ id: 'dupliacted-offer-1', venue: { id: 'venue-1' }, _geoloc: 'loc1' }],
          },
        },
        {
          offersResponse: { hits: [{ id: 'offer-2' }], nbHits: 100 },
          duplicatedOffersResponse: {
            hits: [{ id: 'dupliacted-offer-2', venue: { id: 'venue-2' }, _geoloc: 'loc2' }],
          },
        },
      ],
      pageParams: [],
    } as unknown as InfiniteData<FetchSearchOffersResponse>

    const result = selectSearchOffers({ data: mockData, transformHits })

    expect(result.offers).toHaveLength(2)
    expect(result.offers[0]).toMatchObject({ id: 'offer-1' })
    expect(result.duplicatedOffers).toHaveLength(2)
    expect(result.duplicatedOffers[0]).toMatchObject({ id: 'dupliacted-offer-1' })
  })

  it('should extract unique venues from duplicated offers', () => {
    const mockData = {
      pages: [
        {
          offersResponse: { hits: [] },
          duplicatedOffersResponse: {
            hits: [
              { id: '1', venue: { id: 'venue-1' }, _geoloc: 'loc1' },
              { id: '2', venue: { id: 'venue-1' }, _geoloc: 'loc1' },
              { id: '3', venue: { id: 'venue-2' }, _geoloc: 'loc2' },
            ],
          },
        },
      ],
      pageParams: [],
    } as unknown as InfiniteData<FetchSearchOffersResponse>

    const result = selectSearchOffers({ data: mockData, transformHits })

    expect(result.offerVenues).toHaveLength(1)
    expect(result.offerVenues).toEqual([
      {
        _geoloc: 'loc1',
        activity: null,
        banner_url: null,
        info: '',
        isOpenToPublic: true,
        isPermanent: null,
        label: '',
        postalCode: null,
        venueId: 'venue-1',
      },
    ])
  })

  it('should return metadata (nbHits, userData) from the first page', () => {
    const mockData = {
      pages: [
        {
          offersResponse: { hits: [{}], nbHits: 42, userData: [{ message: 'user-data message' }] },
          duplicatedOffersResponse: { hits: [] },
        },
      ],
      pageParams: [],
    } as unknown as InfiniteData<FetchSearchOffersResponse>

    const result = selectSearchOffers({ data: mockData, transformHits })

    expect(result.nbHits).toBe(42)
    expect(result.userData).toEqual([{ message: 'user-data message' }])
  })

  it('should identify the last page correctly', () => {
    const firstPage = {
      offersResponse: { hits: [] },
      duplicatedOffersResponse: { hits: [] },
    } as unknown as FetchSearchOffersResponse
    const secondPage = {
      offersResponse: { hits: ['last'], nbHits: 1 },
      duplicatedOffersResponse: { hits: [] },
    } as unknown as FetchSearchOffersResponse

    const mockData: InfiniteData<FetchSearchOffersResponse> = {
      pages: [firstPage, secondPage],
      pageParams: [null, 'page-params-1'],
    }

    const result = selectSearchOffers({ data: mockData, transformHits })

    expect(result.lastPage).toEqual(secondPage)
  })

  it('should fallback to flattened offers length if nbHits is missing', () => {
    const mockData = {
      pages: [
        {
          offersResponse: { hits: [{}, {}] },
          duplicatedOffersResponse: { hits: [] },
        },
      ],
      pageParams: [],
    } as unknown as InfiniteData<FetchSearchOffersResponse>

    const result = selectSearchOffers({ data: mockData, transformHits })

    expect(result.nbHits).toBe(2)
  })
})
