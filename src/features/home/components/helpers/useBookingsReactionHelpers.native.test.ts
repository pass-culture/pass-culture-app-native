import { BookingsResponse, ReactionTypeEnum, SubcategoriesResponseModelv2 } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { useBookingsReactionHelpers } from 'features/home/components/helpers/useBookingsReactionHelpers'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockUseIsCookiesListUpToDate = jest
  .spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate')
  .mockReturnValue({
    isCookiesListUpToDate: true,
    cookiesLastUpdate: { lastUpdated: new Date('10/12/2022'), lastUpdateBuildVersion: 10208002 },
  })
jest.mock('libs/firebase/analytics/analytics') // mocking analytics used in useIsCookiesListUpToDate

jest.useFakeTimers()

describe('useBookingsReactionHelpers', () => {
  it('should return false when FF wipReactionFeature is false', () => {
    setFeatureFlags()

    const { result } = renderHook(() => useBookingsReactionHelpers(endedBookingWithoutReaction))

    expect(result.current.shouldShowReactionModal).toBeFalsy()
    expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
  })

  describe('when FF wipReactionFeature is true', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    })

    it('should return false if the bookings already have reactions', () => {
      const { result } = renderHook(() => useBookingsReactionHelpers(endedBookingWithReaction))

      expect(result.current.shouldShowReactionModal).toBeFalsy()
      expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
    })

    it('should return false if cookies where not accepted', () => {
      cookiesNotAccepted()

      const { result } = renderHook(() => useBookingsReactionHelpers(endedBookingWithoutReaction))

      expect(result.current.shouldShowReactionModal).toBeFalsy()
      expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
    })

    it('should return true if there are bookings to react to', () => {
      const { result } = renderHook(() => useBookingsReactionHelpers(endedBookingWithoutReaction))

      expect(result.current.shouldShowReactionModal).toBeTruthy()
      expect(result.current.bookingsEligibleToReaction).toEqual(
        endedBookingWithoutReaction.ended_bookings
      )
    })
  })
})

function cookiesNotAccepted() {
  mockUseIsCookiesListUpToDate.mockReturnValueOnce({
    isCookiesListUpToDate: true,
    cookiesLastUpdate: undefined,
  })
}

const endedBookingWithoutReaction: BookingsResponse = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: null,
      enablePopUpReaction: true,
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithReaction: BookingsResponse = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: ReactionTypeEnum.LIKE,
      enablePopUpReaction: true,
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}
