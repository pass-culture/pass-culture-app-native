import { SearchGroupNameEnumv2 } from 'api/gen'
import { useSameArtistPlaylist } from 'features/offer/helpers/useSameArtistPlaylist/useSameArtistPlaylist'
import { mockedAlgoliaOffersWithSameArtistResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import * as fetchOffersByArtist from '../../api/fetchOffersByArtist/fetchOffersByArtist'

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
          venueLocation: { latitude: 47.65904, longitude: -2.75922 },
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
        venueLocation: { latitude: 47.65904, longitude: -2.75922 },
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
          venueLocation: { latitude: 47.65904, longitude: -2.75922 },
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(fetchOffersByArtistSpy).not.toHaveBeenCalled()
    })
  })
})
