import mockdate from 'mockdate'

import {
  BookingsResponse,
  NativeCategoryIdEnumv2,
  ReactionTypeEnum,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { useBookingsReactionHelpers } from 'features/home/components/helpers/useBookingsReactionHelpers'
import { TWENTY_FOUR_HOURS } from 'features/home/constants'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

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
  beforeAll(() => {
    useRemoteConfigContextSpy.mockReturnValue({
      ...DEFAULT_REMOTE_CONFIG,
      reactionCategories: {
        categories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA],
      },
    })
  })

  beforeEach(() => {
    mockdate.set(CURRENT_DATE)
  })

  it('should return false when FF wipReactionFeature is false', () => {
    setFeatureFlags()

    const { result } = renderHook(() =>
      useBookingsReactionHelpers(endedBookingWithoutReactionAndDateUsedMoreThan24hAgo)
    )

    expect(result.current.shouldShowReactionModal).toBeFalsy()
    expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
  })

  describe('when FF wipReactionFeature is true', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    })

    it('should return false if there are no bookings to react to', () => {
      const { result } = renderHook(() => useBookingsReactionHelpers(endedBookingWithReaction))

      expect(result.current.shouldShowReactionModal).toBeFalsy()
      expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
    })

    it('should return false if the bookings already have reactions', () => {
      const { result } = renderHook(() =>
        useBookingsReactionHelpers(endedBookingWithReactionAndDateUsedMoreThan24hAfterCurrentDate)
      )

      expect(result.current.shouldShowReactionModal).toBeFalsy()
      expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
    })

    it('should return false if cookies where not accepted', () => {
      cookiesNotAccepted()

      const { result } = renderHook(() =>
        useBookingsReactionHelpers(endedBookingWithoutReactionAndDateUsedMoreThan24hAgo)
      )

      expect(result.current.shouldShowReactionModal).toBeFalsy()
      expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
    })

    it('should return false if there is a booking without reaction after 24 hours but the subcategory of the booking is not in reactionCategories remote config', async () => {
      const { result } = renderHook(() =>
        useBookingsReactionHelpers(
          endedBookingForInstrumentWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate
        )
      )

      expect(result.current.shouldShowReactionModal).toBeFalsy()
      expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
    })

    it('should return false if less than 24 hours have passed', () => {
      const { result } = renderHook(() =>
        useBookingsReactionHelpers(
          endedBookingWithoutReactionAndDateUsedLessThan24hAfterCurrentDate
        )
      )

      expect(result.current.shouldShowReactionModal).toBeFalsy()
      expect(result.current.bookingsEligibleToReaction).toHaveLength(0)
    })

    it('should return true if there are bookings to react to', () => {
      const { result } = renderHook(() =>
        useBookingsReactionHelpers(endedBookingWithoutReactionAndDateUsedMoreThan24hAgo)
      )

      expect(result.current.shouldShowReactionModal).toBeTruthy()
      expect(result.current.bookingsEligibleToReaction).toEqual(
        endedBookingWithoutReactionAndDateUsedMoreThan24hAgo.ended_bookings
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

const lessThan24hAfterCurrentDate = new Date(
  CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS + 1000
).toISOString()
const moreThan24hAfterCurrentDate = new Date(
  CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000
).toISOString()

const endedBookingWithoutReactionAndDateUsedMoreThan24hAgo: BookingsResponse = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: null,
      dateUsed: moreThan24hAfterCurrentDate,
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: {
          ...bookingsSnap.ended_bookings[0].stock.offer,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        },
      },
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithReaction: BookingsResponse = {
  ended_bookings: [{ ...bookingsSnap.ended_bookings[0], userReaction: ReactionTypeEnum.LIKE }],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithReactionAndDateUsedMoreThan24hAfterCurrentDate = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: ReactionTypeEnum.LIKE,
      dateUsed: moreThan24hAfterCurrentDate,
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: {
          ...bookingsSnap.ended_bookings[0].stock.offer,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        },
      },
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingForInstrumentWithoutReactionAndDateUsedMoreThan24hAfterCurrentDate = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: null,
      dateUsed: moreThan24hAfterCurrentDate,
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: {
          ...bookingsSnap.ended_bookings[0].stock.offer,
          subcategoryId: SubcategoryIdEnum.ACHAT_INSTRUMENT,
        },
      },
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}

const endedBookingWithoutReactionAndDateUsedLessThan24hAfterCurrentDate = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: null,
      dateUsed: lessThan24hAfterCurrentDate,
      stock: {
        ...bookingsSnap.ended_bookings[0].stock,
        offer: {
          ...bookingsSnap.ended_bookings[0].stock.offer,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        },
      },
    },
  ],
  ongoing_bookings: [],
  hasBookingsAfter18: false,
}
