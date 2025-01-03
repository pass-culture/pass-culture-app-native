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
import { useShouldShowReactionModal } from 'features/home/components/helpers/useShouldShowReactionModal'
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

describe('useShouldShowReactionModal', () => {
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
      useShouldShowReactionModal(endedBookingWithoutReactionAndDateUsedMoreThan24hAgo)
    )

    expect(result.current.shouldShowReactionModal).toBeFalsy()
  })

  describe('when FF wipReactionFeature is true', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_REACTION_FEATURE])
    })

    it('should return false if there are no bookings to react to', () => {
      const { result } = renderHook(() => useShouldShowReactionModal(endedBookingWithReaction))

      expect(result.current.shouldShowReactionModal).toBeFalsy()
    })

    it('should return false if cookies where not accepted', () => {
      cookiesNotAccepted()

      const { result } = renderHook(() =>
        useShouldShowReactionModal(endedBookingWithoutReactionAndDateUsedMoreThan24hAgo)
      )

      expect(result.current.shouldShowReactionModal).toBeFalsy()
    })

    it('should return true if there are bookings to react to', () => {
      const { result } = renderHook(() =>
        useShouldShowReactionModal(endedBookingWithoutReactionAndDateUsedMoreThan24hAgo)
      )

      expect(result.current.shouldShowReactionModal).toBeTruthy()
    })
  })
})

function cookiesNotAccepted() {
  mockUseIsCookiesListUpToDate.mockReturnValueOnce({
    isCookiesListUpToDate: true,
    cookiesLastUpdate: undefined,
  })
}

const endedBookingWithoutReactionAndDateUsedMoreThan24hAgo: BookingsResponse = {
  ended_bookings: [
    {
      ...bookingsSnap.ended_bookings[0],
      userReaction: null,
      dateUsed: new Date(CURRENT_DATE.getTime() - TWENTY_FOUR_HOURS - 1000).toISOString(),
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
