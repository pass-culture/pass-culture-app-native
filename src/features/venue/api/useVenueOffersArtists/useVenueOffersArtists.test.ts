import { shuffle } from 'lodash'
import { UseQueryResult } from 'react-query'

import { SubcategoryIdEnum } from 'api/gen'
import { useVenueOffersArtists } from 'features/venue/api/useVenueOffersArtists/useVenueOffersArtists'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const useVenueOffersSpy = jest.spyOn(useVenueOffers, 'useVenueOffers').mockReturnValue({
  isLoading: false,
  data: {
    hits: [],
    nbHits: 0,
  },
} as unknown as UseQueryResult<VenueOffers, unknown>)

const mockBaseOffer = {
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
  artists: [
    {
      id: '1',
      name: 'Céline Dion',
      image:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
    },
  ],
}

describe('useVenueOffersArtists', () => {
  it('should return empty artists array when useVenueOffers hook data is undefined', () => {
    const { result } = renderHook(() => useVenueOffersArtists(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.data).toEqual({ artists: [] })
  })

  it('should return empty artists array when there are no offers', async () => {
    const { result } = renderHook(() => useVenueOffersArtists([]), {
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
          mockBaseOffer,
          mockBaseOffer,
          {
            ...mockBaseOffer,
            offer: {
              ...mockBaseOffer.offer,
              artist: 'Christopher Nolan',
              subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
            },
            artists: [
              {
                id: '2',
                name: 'Christopher Nolan',
                image:
                  'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
              },
            ],
          },
          {
            ...mockBaseOffer,
            offer: {
              ...mockBaseOffer.offer,
              artist: 'collectif',
            },
            artists: [
              {
                id: '3',
                name: 'collectif',
                image:
                  'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
              },
            ],
          },
          {
            ...mockBaseOffer,
            offer: {
              ...mockBaseOffer.offer,
              artist: 'collectifs',
            },
            artists: [
              {
                id: '4',
                name: 'collectifs',
                image:
                  'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
              },
            ],
          },
        ],
        nbHits: 5,
      },
    } as unknown as UseQueryResult<VenueOffers, unknown>)

    const { result } = renderHook(() => useVenueOffersArtists(mockVenueResponse), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => {
      expect(result.current.data).toEqual({
        artists: [
          {
            id: '1',
            image:
              'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
            name: 'Céline Dion',
          },
        ],
      })
    })
  })

  it('should return 30 artists max / unique by id / ordered by number of offers / ordered by names', async () => {
    // We have 2 times Artist 1 to 15 and 1 time Artist 16 to 30
    const mockedArtistList = Array.from({ length: 45 }, (_, index) => ({
      objectID: ((index % 30) + 1).toString(),
      offer: {
        artist: `Artist ${(index % 30) + 1}`,
        thumbUrl:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
        subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
      },
      artists: [
        {
          id: ((index % 30) + 1).toString(),
          name: `Artist ${(index % 30) + 1}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
        },
      ],
    }))

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

    const expectedArtistsList =
      // Artiste 1
      Array.from({ length: 1 }, (_, index) => ({
        id: `${index + 1}`,
        image:
          'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
        name: `Artist ${index + 1}`,
      })).concat(
        // Artiste 10 to 15
        Array.from({ length: 6 }, (_, index) => ({
          id: `${index + 10}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: `Artist ${index + 10}`,
        })),
        // Artiste 2 to 9
        Array.from({ length: 8 }, (_, index) => ({
          id: `${index + 2}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: `Artist ${index + 2}`,
        })),
        // Artiste 16 to 30
        Array.from({ length: 15 }, (_, index) => ({
          id: `${index + 16}`,
          image:
            'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/CDZQ',
          name: `Artist ${index + 16}`,
        }))
      )

    await waitFor(async () => {
      expect(result.current.data).toEqual({
        artists: expectedArtistsList,
      })
    })
  })
})
