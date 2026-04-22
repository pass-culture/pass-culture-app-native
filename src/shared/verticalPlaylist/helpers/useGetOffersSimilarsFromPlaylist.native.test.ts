import { SearchGroupNameEnumv2 } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { PlaylistType } from 'features/offer/enums'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { renderHook } from 'tests/utils'

import { useGetOffersSimilarsFromPlaylist } from './useGetOffersSimilarsFromPlaylist'

jest.mock('features/offer/helpers/useOfferPlaylist/useOfferPlaylist')
const mockUseOfferPlaylist = useOfferPlaylist as jest.Mock

const baseParams = {
  offer: mockOffer,
  offerSearchGroup: SearchGroupNameEnumv2.CINEMA,
  searchGroupList: [],
}

describe('useGetOffersSimilarsFromPlaylist', () => {
  it('should return same category playlist', () => {
    mockUseOfferPlaylist.mockReturnValueOnce({
      sameCategorySimilarOffers: [mockOffer, mockOffer],
      otherCategoriesSimilarOffers: [mockOffer],
    })

    const { result } = renderHook(() =>
      useGetOffersSimilarsFromPlaylist({
        ...baseParams,
        type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
    )

    expect(result.current.items).toEqual([mockOffer, mockOffer])
    expect(result.current.title).toBe('Dans la même catégorie')
  })

  it('should return other categories playlist', () => {
    mockUseOfferPlaylist.mockReturnValueOnce({
      sameCategorySimilarOffers: [mockOffer],
      otherCategoriesSimilarOffers: [mockOffer, mockOffer],
    })

    const { result } = renderHook(() =>
      useGetOffersSimilarsFromPlaylist({
        ...baseParams,
        type: PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS,
      })
    )

    expect(result.current.items).toEqual([mockOffer, mockOffer])
    expect(result.current.title).toBe('Ça peut aussi te plaire')
  })

  it('should return empty data when no playlist matches', () => {
    const unknownType = 'UNKNOWN' as PlaylistType
    mockUseOfferPlaylist.mockReturnValueOnce({
      sameCategorySimilarOffers: [mockOffer],
      otherCategoriesSimilarOffers: [mockOffer],
    })

    const { result } = renderHook(() => {
      return useGetOffersSimilarsFromPlaylist({
        ...baseParams,
        type: unknownType,
      })
    })

    expect(result.current.items).toEqual([])
    expect(result.current.title).toBe('')
  })

  it('should handle undefined offers safely', () => {
    mockUseOfferPlaylist.mockReturnValueOnce({
      sameCategorySimilarOffers: undefined,
      otherCategoriesSimilarOffers: undefined,
    })

    const { result } = renderHook(() =>
      useGetOffersSimilarsFromPlaylist({
        ...baseParams,
        type: PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS,
      })
    )

    expect(result.current.items).toEqual([])
  })
})
