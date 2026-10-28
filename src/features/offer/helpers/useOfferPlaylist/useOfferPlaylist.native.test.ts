import { OfferPagePlaylist } from 'api/gen'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import * as useOfferPagePlaylistsAPI from 'features/offer/queries/useOfferPagePlaylistsQuery'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { renderHook } from 'tests/utils'

const offer = offerResponseSnap

const mockPlaylists: OfferPagePlaylist[] = [
  {
    title: 'Les fans aiment aussi',
    analyticsPlaylistType: 'sameCategorySimilarOffersTwoTower',
    results: ['1', '2', '3'],
    params: {
      recoOrigin: 'similar_offer',
      modelOrigin: 'default',
      callId: '4c0364f6-9398-465f-9b30-8286a54670a3',
      uniqueCallId: 'deebda22-4ef6-4c1f-b1cc-f772efd21a6c',
      abTest: 'main',
    },
  },
]

const useOfferPagePlaylistsSpy = jest.spyOn(useOfferPagePlaylistsAPI, 'useOfferPagePlaylistsQuery')

describe('useOfferPlaylist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useLocationV2.setState(defaultLocationState)
    locationActions.setGeolocPosition({ latitude: 90.4773245, longitude: 90.4773245 })
    locationActions.setLocationMode(LocationMode.AROUND_ME)

    useOfferPagePlaylistsSpy.mockReturnValue({
      data: {
        fromCache: false,
        offerId: offer.id.toString(),
        playlists: mockPlaylists,
      },
    } as ReturnType<typeof useOfferPagePlaylistsAPI.useOfferPagePlaylistsQuery>)
  })

  describe('When offer is defined', () => {
    it('should return playlists from query when available', () => {
      const { result } = renderHook(() =>
        useOfferPlaylist({
          offer,
        })
      )

      expect(result.current).toEqual(mockPlaylists)
    })

    it('should call useOfferPagePlaylistsQuery with rounded position when location is set', () => {
      renderHook(() =>
        useOfferPlaylist({
          offer,
        })
      )

      expect(useOfferPagePlaylistsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          offerId: offer.id,
          position: { latitude: 90.477, longitude: 90.477 },
        })
      )
    })

    it('should call offer page playlists query with undefined position when user location is missing', () => {
      useLocationV2.setState(defaultLocationState)

      renderHook(() =>
        useOfferPlaylist({
          offer,
        })
      )

      expect(useOfferPagePlaylistsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          offerId: offer.id,
          position: undefined,
        })
      )
    })
  })
})
