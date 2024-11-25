import * as fetchCinemaOffersModule from 'features/search/pages/ThematicSearch/api/fetchCinemaOffers'
import * as fetchFilmsOffersModule from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { fetchFilmsOffers } from 'features/search/pages/ThematicSearch/api/fetchFilmsOffers'
import { useThematicSearchPlaylists } from 'features/search/pages/ThematicSearch/api/useThematicSearchPlaylists'
import { CINEMA_PLAYLIST_TITLES } from 'features/search/pages/ThematicSearch/Cinema/CinemaPlaylist'
import { FILMS_PLAYLIST_TITLES } from 'features/search/pages/ThematicSearch/Films/FilmsPlaylist'
import { LocationMode, Position } from 'libs/location/types'
import { QueryKeys } from 'libs/queryKeys'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 2, longitude: 2 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

const filmsOffer = mockBuilder.searchResponseOffer({})

const fetchCinemaOffersSpy = jest
  .spyOn(fetchCinemaOffersModule, 'fetchCinemaOffers')
  .mockResolvedValue([filmsOffer])

const fetchFilmOffersSpy = jest
  .spyOn(fetchFilmsOffersModule, 'fetchFilmsOffers')
  .mockResolvedValue([filmsOffer])

jest.mock('libs/firebase/analytics/analytics')

describe('useCinemaOffers', () => {
  it('should fetch film offers', async () => {
    renderHook(
      () =>
        useThematicSearchPlaylists({
          playlistTitles: FILMS_PLAYLIST_TITLES,
          fetchMethod: fetchFilmsOffers,
          queryKey: QueryKeys.FILMS_OFFERS,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(() => {})

    expect(fetchFilmOffersSpy).toHaveBeenCalledWith(mockUserLocation),
      expect.any(Object),
      false,
      undefined
  })

  it('should fetch cinema offers', async () => {
    renderHook(
      () =>
        useThematicSearchPlaylists({
          playlistTitles: CINEMA_PLAYLIST_TITLES,
          fetchMethod: fetchCinemaOffersModule.fetchCinemaOffers,
          queryKey: QueryKeys.CINEMA_OFFERS,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await act(() => {})

    expect(fetchCinemaOffersSpy).toHaveBeenCalledWith(mockUserLocation),
      expect.any(Object),
      false,
      undefined
  })
})
