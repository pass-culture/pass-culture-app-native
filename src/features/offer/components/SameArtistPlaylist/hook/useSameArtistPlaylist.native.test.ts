import { SearchGroupNameEnumv2 } from 'api/gen'
import { useSameArtistPlaylist } from 'features/offer/components/SameArtistPlaylist/hook/useSameArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import * as fetchOffersByArtist from './../api/fetchOffersByArtist'

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

const fetchOffersByArtistSpy = jest
  .spyOn(fetchOffersByArtist, 'fetchOffersByArtist')
  .mockResolvedValue(mockedAlgoliaOffersWithSameArtistResponse)

describe('useSameArtistPlaylist', () => {
  it('should fetch same artist playlist when user has Internet connection', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    renderHook(
      () =>
        useSameArtistPlaylist({
          artists: 'Eiichiro Oda',
          ean: '9782723492607',
          searchGroupName: SearchGroupNameEnumv2.LIVRES,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artists: 'Eiichiro Oda',
        ean: '9782723492607',
        searchGroupName: SearchGroupNameEnumv2.LIVRES,
      })
    })
  })

  it('should not fetch same artist playlist when user has not Internet connection', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderHook(
      () =>
        useSameArtistPlaylist({
          artists: 'Eiichiro Oda',
          ean: '9782723492607',
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

  it('should not fetch same artist playlist when artist, ean, searchGroupName are missing', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    renderHook(
      () =>
        useSameArtistPlaylist({
          artists: '',
          ean: '',
          searchGroupName: undefined,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artists: '',
        ean: '',
        searchGroupName: undefined,
      })
    })
  })

  it('should handle null or undefined values for artist, ean, and searchGroupName', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    renderHook(
      () =>
        useSameArtistPlaylist({
          artists: null,
          ean: null,
          searchGroupName: undefined,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artists: null,
        ean: null,
        searchGroupName: undefined,
      })
    })
  })
})
