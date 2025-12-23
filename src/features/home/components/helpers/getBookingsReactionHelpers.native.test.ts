import { BookingsResponseV2, ReactionTypeEnum, SubcategoriesResponseModelv2 } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import {
  ModalDisplayState,
  getBookingsReactionHelpers,
} from 'features/home/components/helpers/getBookingsReactionHelpers'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('queries/subcategories/useSubcategoriesQuery', () => ({
  useSubcategoriesQuery: () => ({
    data: mockData,
  }),
}))

jest.mock('libs/firebase/analytics/analytics') // mocking analytics used in useIsCookiesListUpToDate

jest.useFakeTimers()

describe('getBookingsReactionHelpers', () => {
  it('should return shouldNotShow if the bookings already have reactions', () => {
    const { result } = renderHook(() => getBookingsReactionHelpers(endedBookingWithReaction, false))

    expect(result.current.shouldShowReactionModal).toEqual(ModalDisplayState.SHOULD_NOT_SHOW)
  })

  it('should return shouldShow if there are bookings to react to', () => {
    const { result } = renderHook(() =>
      getBookingsReactionHelpers(endedBookingWithoutReaction, false)
    )

    expect(result.current.shouldShowReactionModal).toEqual(ModalDisplayState.SHOULD_SHOW)
    expect(result.current.bookingsEligibleToReaction).toEqual(
      endedBookingWithoutReaction.endedBookings
    )
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
