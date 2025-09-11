import { BookingsResponseV2, ReactionTypeEnum, SubcategoriesResponseModelv2 } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import {
  ModalDisplayState,
  useBookingsReactionHelpers,
} from 'features/home/components/helpers/useBookingsReactionHelpers'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

jest.mock('libs/firebase/analytics/analytics') // mocking analytics used in useIsCookiesListUpToDate

jest.useFakeTimers()

describe('useBookingsReactionHelpers', () => {
  it('should return false when FF wipReactionFeature is false', () => {
    setFeatureFlags()

    const { result } = renderHook(() =>
      useBookingsReactionHelpers(endedBookingWithoutReaction, false)
    )

    expect(result.current.shouldShowReactionModal).toEqual(ModalDisplayState.SHOULD_NOT_SHOW)
  })

  describe('when FF wipReactionFeature is true', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    })

    it('should return shouldNotShow if the bookings already have reactions', () => {
      const { result } = renderHook(() =>
        useBookingsReactionHelpers(endedBookingWithReaction, false)
      )

      expect(result.current.shouldShowReactionModal).toEqual(ModalDisplayState.SHOULD_NOT_SHOW)
    })

    it('should return shouldShow if there are bookings to react to', () => {
      const { result } = renderHook(() =>
        useBookingsReactionHelpers(endedBookingWithoutReaction, false)
      )

      expect(result.current.shouldShowReactionModal).toEqual(ModalDisplayState.SHOULD_SHOW)
      expect(result.current.bookingsEligibleToReaction).toEqual(
        endedBookingWithoutReaction.endedBookings
      )
    })
  })
})

const endedBookingWithoutReaction: BookingsResponseV2 = {
  endedBookings: [
    {
      ...bookingsSnapV2.endedBookings[0],
      userReaction: null,
      enablePopUpReaction: true,
    },
  ],
  ongoingBookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithReaction: BookingsResponseV2 = {
  endedBookings: [
    {
      ...bookingsSnapV2.endedBookings[0],
      userReaction: ReactionTypeEnum.LIKE,
      enablePopUpReaction: true,
    },
  ],
  ongoingBookings: [],
  hasBookingsAfter18: false,
}
