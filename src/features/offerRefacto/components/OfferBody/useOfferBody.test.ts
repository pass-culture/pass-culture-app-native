import { navigate } from '__mocks__/@react-navigation/native'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { act, renderHook } from 'tests/utils'

import { useOfferBody } from './useOfferBody'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => ({ getQueryData: () => null }),
}))

jest.mock('features/offer/helpers/useOfferPlaylist/useOfferPlaylist', () => ({
  useOfferPlaylist: () => ({
    sameCategorySimilarOffers: [],
    apiRecoParamsSameCategory: undefined,
    otherCategoriesSimilarOffers: [],
    apiRecoParamsOtherCategories: undefined,
  }),
}))

jest.mock('libs/location/location', () => ({
  useLocation: () => ({
    userLocation: null,
    selectedPlace: null,
    selectedLocationMode: 'EVERYWHERE',
  }),
}))

jest.mock('features/offer/helpers/getVenueBlockProps', () => ({
  getVenue: () => ({ coordinates: null }),
}))

jest.mock('features/offer/helpers/useOfferImageContainerDimensions', () => ({
  useOfferImageContainerDimensions: () => ({
    backgroundHeight: 100,
    imageStyle: { height: 200, width: 150, maxWidth: 300, aspectRatio: 2 / 3, borderRadius: 8 },
  }),
}))

const defaultParams = {
  offer: offerResponseSnap,
  subcategory: mockSubcategory,
  searchGroupList: [],
}

describe('useOfferBody', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all expected ViewModel properties', () => {
    const { result } = renderHook(() => useOfferBody(defaultParams))

    expect(result.current).toEqual(
      expect.objectContaining({
        offerImages: expect.any(Array),
        placeholderImage: undefined,
        distance: null,
        onSeeMoreButtonPress: expect.any(Function),
        onSeeAllReviewsPress: expect.any(Function),
      })
    )
  })

  it('should call analytics.logConsultChronicle on onSeeMoreButtonPress', () => {
    const { result } = renderHook(() => useOfferBody(defaultParams))

    act(() => {
      result.current.onSeeMoreButtonPress(42)
    })

    expect(analytics.logConsultChronicle).toHaveBeenCalledWith({
      offerId: offerResponseSnap.id,
      chronicleId: 42,
    })
  })

  it('should navigate to Chronicles on onSeeMoreButtonPress', () => {
    const { result } = renderHook(() => useOfferBody(defaultParams))

    act(() => {
      result.current.onSeeMoreButtonPress(42)
    })

    expect(navigate).toHaveBeenCalledWith('Chronicles', {
      offerId: offerResponseSnap.id,
      chronicleId: 42,
      from: 'chronicles',
    })
  })

  it('should call analytics.logClickInfoReview on onSeeAllReviewsPress', () => {
    const { result } = renderHook(() => useOfferBody(defaultParams))

    act(() => {
      result.current.onSeeAllReviewsPress()
    })

    expect(analytics.logClickInfoReview).toHaveBeenCalledWith({
      from: 'offer',
      offerId: offerResponseSnap.id.toString(),
      categoryName: mockSubcategory.categoryId,
      userId: undefined,
    })
  })
})
