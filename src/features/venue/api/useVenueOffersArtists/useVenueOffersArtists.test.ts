import { orderBy, shuffle } from 'lodash'
import { UseQueryResult } from 'react-query'

import { SubcategoryIdEnum } from 'api/gen'
import * as useVenueOffers from 'features/venue/api/useVenueOffers'
import { useVenueOffersArtists } from 'features/venue/api/useVenueOffersArtists/useVenueOffersArtists'
import { VenueOffers } from 'features/venue/types'
import mockVenueResponse from 'fixtures/venueResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const useVenueOffersSpy = jest.spyOn(useVenueOffers, 'useVenueOffers').mockReturnValue({
  isLoading: false,
  data: {
    hits: [],
    nbHits: 0,
  },
} as unknown as UseQueryResult<VenueOffers, unknown>)

describe('useVenueOffersArtists', () => {
  it('should return empty artists array when useVenueOffers hook data is undefined', () => {
    const { result } = renderHook(() => useVenueOffersArtists(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.data).toEqual({ artists: [] })
  })

  it('should return empty artists array when there are no offers', async () => {
    const { result } = renderHook(() => useVenueOffersArtists(mockVenueResponse), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => {
      expect(result.current.data).toEqual({ artists: [] })
    })
  })

  it('should return artists when there are offers', async () => {
    useVenueOffersSpy.mockReturnValueOnce({
      isLoading: false,
      data: {
        hits: [
          {
            offer: {
              dates: [],
              isDigital: false,
              isDuo: false,
              name: 'I want something more',
              prices: [28.0],
              subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
              thumbUrl:
                'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
              artist: 'Céline Dion',
            },
            _geoloc: { lat: 4.90339, lng: -52.31663 },
            objectID: '102310',
            venue: {
              id: 4,
              name: 'Lieu 4',
              publicName: 'Lieu 4',
              address: '4 rue de la paix',
              postalCode: '75000',
              city: 'Paris',
            },
          },
          {
            offer: {
              dates: [],
              isDigital: false,
              isDuo: false,
              name: 'I want something more',
              prices: [28.0],
              subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
              thumbUrl:
                'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
              artist: 'Céline Dion',
            },
            _geoloc: { lat: 4.90339, lng: -52.31663 },
            objectID: '102310',
            venue: {
              id: 4,
              name: 'Lieu 4',
              publicName: 'Lieu 4',
              address: '4 rue de la paix',
              postalCode: '75000',
              city: 'Paris',
            },
          },
        ],
        nbHits: 2,
      },
    } as unknown as UseQueryResult<VenueOffers, unknown>)

    const { result } = renderHook(() => useVenueOffersArtists(mockVenueResponse), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => {
      expect(result.current.data).toEqual({
        artists: [
          {
            id: 102310,
            image:
              'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
            name: 'Céline Dion',
          },
        ],
      })
    })
  })

  it('should return 30 artists max / unique by name / with at list one offer / ordered by number of offers / ordered by names', async () => {
    const mockedArtistList = Array.from({ length: 75 }, (_, index) => ({
      objectID: (index % 35).toString(),
      offer: {
        artist: `Artist ${index % 35}`,
        thumbUrl:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
        subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      },
    }))

    if (mockedArtistList[0]) mockedArtistList[0].offer.artist = 'James Bond, OSS 117'
    if (mockedArtistList[35]) mockedArtistList[35].offer.artist = 'James Bond, OSS 117'
    if (mockedArtistList[70]) mockedArtistList[70].offer.artist = 'James Bond, OSS 117'
    if (mockedArtistList[10]) mockedArtistList[10].offer.artist = 'collectif MI6'
    if (mockedArtistList[45]) mockedArtistList[45].offer.artist = 'collectif MI6'

    useVenueOffersSpy.mockReturnValueOnce({
      isLoading: false,
      data: {
        hits: shuffle(mockedArtistList),
        nbHits: mockedArtistList.length,
      },
    } as unknown as UseQueryResult<VenueOffers, unknown>)

    const { result } = renderHook(() => useVenueOffersArtists(mockVenueResponse), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedArtistsList = Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      image:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
      name: `Artist ${index + 1}`,
    })).concat(
      orderBy(
        Array.from({ length: 24 }, (_, index) => ({
          id: index + 11,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: `Artist ${index + 11}`,
        })),
        'name',
        'asc'
      ),
      [
        {
          id: 5,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: 'Artist 5',
        },
        {
          id: 6,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: 'Artist 6',
        },
      ]
    )

    await waitFor(async () => {
      expect(result.current.data).toEqual({
        artists: expectedArtistsList,
      })
    })
  })
})
