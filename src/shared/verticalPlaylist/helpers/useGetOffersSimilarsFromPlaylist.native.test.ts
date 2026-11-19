import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { PlaylistType } from 'features/offer/enums'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { useAlgoliaSimilarOffersQuery } from 'queries/offer/useAlgoliaSimilarOffersQuery'
import { renderHook } from 'tests/utils'

import { useGetOffersSimilarsFromPlaylist } from './useGetOffersSimilarsFromPlaylist'

jest.mock('features/offer/helpers/useOfferPlaylist/useOfferPlaylist')
jest.mock('queries/offer/useAlgoliaSimilarOffersQuery')

const mockUseOfferPlaylist = useOfferPlaylist as jest.Mock
const mockUseAlgoliaSimilarOffersQuery = useAlgoliaSimilarOffersQuery as jest.Mock

const baseParams = {
  offer: mockOffer,
  userId: 12345,
}

const mockApiParams = {
  recoOrigin: 'similar_offer',
  modelOrigin: 'default',
  callId: '4c0364f6-9398-465f-9b30-8286a54670a3',
  uniqueCallId: 'deebda22-4ef6-4c1f-b1cc-f772efd21a6c',
  abTest: 'main',
}

const mockPlaylists = [
  {
    title: 'Les fans aiment aussi',
    analyticsPlaylistType: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
    results: ['101', '102'],
    params: mockApiParams,
  },
  {
    title: 'Dans la même catégorie',
    analyticsPlaylistType: 'sameCategorySimilarOffersTwoTower',
    results: ['201', '202'],
    params: mockApiParams,
  },
]

describe('useGetOffersSimilarsFromPlaylist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseOfferPlaylist.mockReturnValue(mockPlaylists)
    mockUseAlgoliaSimilarOffersQuery.mockReturnValue([mockOffer, mockOffer])
  })

  it('should return matching playlist offers and dynamic title from API', () => {
    const { result } = renderHook(() =>
      useGetOffersSimilarsFromPlaylist({
        ...baseParams,
        type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
    )

    expect(mockUseAlgoliaSimilarOffersQuery).toHaveBeenCalledWith(['101', '102'], true)
    expect(result.current.items).toEqual([mockOffer, mockOffer])
    expect(result.current.title).toEqual('Les fans aiment aussi')
  })

  it('should return empty items and empty title when no playlist matches the type', () => {
    mockUseAlgoliaSimilarOffersQuery.mockReturnValueOnce([])

    const { result } = renderHook(() =>
      useGetOffersSimilarsFromPlaylist({
        ...baseParams,
        type: 'UNKNOWN_TYPE',
      })
    )

    expect(mockUseAlgoliaSimilarOffersQuery).toHaveBeenCalledWith([], true)
    expect(result.current.items).toEqual([])
    expect(result.current.title).toEqual('')
  })

  it('should return an empty array when Algolia query returns undefined', () => {
    mockUseAlgoliaSimilarOffersQuery.mockReturnValueOnce(undefined)

    const { result } = renderHook(() =>
      useGetOffersSimilarsFromPlaylist({
        ...baseParams,
        type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
    )

    expect(result.current.items).toEqual([])
    expect(result.current.title).toEqual('Les fans aiment aussi')
  })
})
