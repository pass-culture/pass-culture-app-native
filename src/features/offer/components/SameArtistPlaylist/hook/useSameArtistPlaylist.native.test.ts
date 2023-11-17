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
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artists: 'Eiichiro Oda',
        ean: '9782723492607',
      })
    })
  })

  it('should fetch same artist playlist when user has not Internet connection', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderHook(
      () =>
        useSameArtistPlaylist({
          artists: 'Eiichiro Oda',
          ean: '9782723492607',
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).not.toHaveBeenCalled()
    })
  })

  it('should not fetch same artist playlist when artist and ean are missing', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    renderHook(
      () =>
        useSameArtistPlaylist({
          artists: '',
          ean: '',
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artists: '',
        ean: '',
      })
    })
  })

  it('should handle null artist and null ean gracefully', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
    renderHook(
      () =>
        useSameArtistPlaylist({
          artists: null,
          ean: null,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).toHaveBeenCalledWith({
        artists: null,
        ean: null,
      })
    })
  })
})
