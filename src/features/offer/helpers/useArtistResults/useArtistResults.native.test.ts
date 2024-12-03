import { SearchGroupNameEnumv2 } from 'api/gen'
import { useArtistResults } from 'features/offer/helpers/useArtistResults/useArtistResults'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { Position } from 'libs/location/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import * as fetchOffersByArtist from '../../api/fetchOffersByArtist/fetchOffersByArtist'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

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

describe('useArtistResults', () => {
  it('should fetch same artist playlist when user has Internet connection', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true, isInternetReachable: true })
    renderHook(
      () =>
        useArtistResults({
          artists: 'Eiichiro Oda',
          searchGroupName: SearchGroupNameEnumv2.LIVRES,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artists: 'Eiichiro Oda',
        searchGroupName: SearchGroupNameEnumv2.LIVRES,
        userLocation: mockUserLocation,
      })
    })
  })

  it('should not fetch artist playlist and top offers when user has not Internet connection', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    renderHook(
      () =>
        useArtistResults({
          artists: 'Eiichiro Oda',
          searchGroupName: SearchGroupNameEnumv2.LIVRES,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).not.toHaveBeenCalled()
    })
  })

  it('should return an empty array for artist playlist when no data returned', async () => {
    fetchOffersByArtistSpy.mockResolvedValueOnce({ playlistHits: [], topOffersHits: [] })

    const { result } = renderHook(
      () =>
        useArtistResults({
          artists: 'Eiichiro Oda',
          searchGroupName: SearchGroupNameEnumv2.LIVRES,
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
        useArtistResults({
          artists: 'Eiichiro Oda',
          searchGroupName: SearchGroupNameEnumv2.LIVRES,
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
