import { SearchGroupNameEnumv2 } from 'api/gen'
import { useSameArtistPlaylist } from 'features/offer/helpers/useSameArtistPlaylist/useSameArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { Position } from 'libs/location/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import * as fetchOffersByArtist from '../../api/fetchOffersByArtist/fetchOffersByArtist'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true })

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

const fetchOffersByArtistSpy = jest
  .spyOn(fetchOffersByArtist, 'fetchOffersByArtist')
  .mockResolvedValue(mockedAlgoliaOffersWithSameArtistResponse)

const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
  }),
}))

describe('useSameArtistPlaylist', () => {
  it('should fetch same artist playlist when user has Internet connection', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    renderHook(
      () =>
        useSameArtistPlaylist({
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

  it('should not fetch same artist playlist when user has not Internet connection', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderHook(
      () =>
        useSameArtistPlaylist({
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

  it('should return an empty array if no data is returned', async () => {
    fetchOffersByArtistSpy.mockResolvedValueOnce([])

    const { result } = renderHook(
      () =>
        useSameArtistPlaylist({
          artists: 'Eiichiro Oda',
          searchGroupName: SearchGroupNameEnumv2.LIVRES,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(result.current.sameArtistPlaylist).toEqual([])
    })
  })
})
