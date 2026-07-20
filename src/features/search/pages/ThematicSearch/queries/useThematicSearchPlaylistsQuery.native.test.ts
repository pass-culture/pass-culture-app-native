import { LocationMode, Position } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { setSettingsMock } from 'tests/settings/mockSettings'
import { renderHook, waitFor } from 'tests/utils'

import { useThematicSearchPlaylistsQuery } from './useThematicSearchPlaylistsQuery'

jest.mock('libs/network/NetInfoWrapper')

const mockUserLocation: Position = { latitude: 2, longitude: 2 }

const defaultThematicSearchOffer = mockBuilder.searchResponseOffer({})

const fetchThematicSearchPlaylistsOffers = jest.fn().mockResolvedValue([defaultThematicSearchOffer])

jest.mock('libs/firebase/analytics/analytics')

setSettingsMock({ patchSettingsWith: { objectStorageUrl: undefined } }) // Avoid thumbUrl change

const PLAYLISTS_TITLES = ['Titre de la playlist - 1', 'Titre de la playlist - 2']

describe('useThematicSearchPlaylists', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    locationActions.setGeolocPosition(mockUserLocation)
  })

  it('should fetch thematic search playlists offers', async () => {
    renderHook(
      () =>
        useThematicSearchPlaylistsQuery({
          playlistTitles: PLAYLISTS_TITLES,
          fetchMethod: fetchThematicSearchPlaylistsOffers,
          queryKey: '',
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    expect(fetchThematicSearchPlaylistsOffers).toHaveBeenCalledTimes(1)
  })

  it('should only return offers with images', async () => {
    const OFFER_WITH_IMAGE = defaultThematicSearchOffer.hits.find((hit) => hit.offer.thumbUrl)
    const { result } = renderHook(
      () =>
        useThematicSearchPlaylistsQuery({
          playlistTitles: PLAYLISTS_TITLES,
          fetchMethod: fetchThematicSearchPlaylistsOffers,
          queryKey: '',
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() =>
      expect(result).toEqual({
        current: {
          playlists: [
            {
              title: PLAYLISTS_TITLES[0],
              offers: {
                hits: [OFFER_WITH_IMAGE],
              },
            },
          ],
          isLoading: false,
        },
      })
    )
  })
})
