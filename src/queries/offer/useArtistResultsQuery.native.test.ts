import { SubcategoryIdEnum } from 'api/gen'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useRemoteConfigQueryAPI from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { Position } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import * as fetchOffersByArtist from './fetchOffersByArtist'
import { useArtistResultsQuery } from './useArtistResultsQuery'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

const fetchOffersByArtistSpy = jest
  .spyOn(fetchOffersByArtist, 'fetchOffersByArtist')
  .mockResolvedValue({
    playlistHits: mockedAlgoliaOffersWithSameArtistResponse,
    topOffersHits: mockedAlgoliaOffersWithSameArtistResponse.splice(0, 4),
  })

const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
  }),
}))

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQueryAPI, 'useRemoteConfigQuery')

describe('useArtistResultsQuery', () => {
  beforeAll(() => {
    useRemoteConfigSpy.mockReturnValue({
      ...DEFAULT_REMOTE_CONFIG,
      artistPageSubcategories: { subcategories: [SubcategoryIdEnum.LIVRE_PAPIER] },
    })
  })

  it('should fetch same artist playlist when artistId and subcategory compatible with artist page defined', async () => {
    renderHook(
      () =>
        useArtistResultsQuery({
          artistId: '1',
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artistId: '1',
        userLocation: mockUserLocation,
      })
    })
  })

  it('should fetch same artist playlist when artistId defined and subcategory not defined', async () => {
    renderHook(
      () =>
        useArtistResultsQuery({
          artistId: '1',
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artistId: '1',
        userLocation: mockUserLocation,
      })
    })
  })

  it('should not fetch same artist playlist when subcategory compatible with artist page defined and artistId not defined', async () => {
    renderHook(
      () =>
        useArtistResultsQuery({
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    expect(fetchOffersByArtistSpy).not.toHaveBeenCalled()
  })

  it('should not fetch same artist playlist when subcategory compatible with artist page and artistId not defined', async () => {
    renderHook(() => useArtistResultsQuery({}), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(fetchOffersByArtistSpy).not.toHaveBeenCalled()
  })

  it('should return an empty array for artist playlist when no data returned', async () => {
    fetchOffersByArtistSpy.mockResolvedValueOnce({ playlistHits: [], topOffersHits: [] })

    const { result } = renderHook(
      () =>
        useArtistResultsQuery({
          artistId: '1',
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(result.current.artistPlaylist).toEqual([])
    })
  })

  it('should return an empty array for artist top offers when no data returned', async () => {
    fetchOffersByArtistSpy.mockResolvedValueOnce({ playlistHits: [], topOffersHits: [] })

    const { result } = renderHook(
      () =>
        useArtistResultsQuery({
          artistId: '1',
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(result.current.artistTopOffers).toEqual([])
    })
  })
})
