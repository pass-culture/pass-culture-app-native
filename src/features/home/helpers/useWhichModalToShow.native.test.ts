import { AchievementEnum, AchievementResponse, BookingsResponse, ReactionTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { ModalToShow, useWhichModalToShow } from 'features/home/helpers/useWhichModalToShow'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')
const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate').mockReturnValue({
  isCookiesListUpToDate: true,
  cookiesLastUpdate: { lastUpdated: new Date('10/12/2022'), lastUpdateBuildVersion: 10208002 },
})

describe('useWhichModalToShow', () => {
  beforeEach(() => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS,
      RemoteStoreFeatureFlags.WIP_REACTION_FEATURE,
    ])
  })

  beforeAll(() => {
    useRemoteConfigContextSpy.mockReturnValue({
      ...DEFAULT_REMOTE_CONFIG,
      displayAchievements: true,
    })
  })

  afterAll(() => {
    useRemoteConfigContextSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
  })

  it('should return achievement if the achievement modal should be shown and the reaction modal should not be shown', () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      achievements: achievements,
    })

    const { result } = renderHook(() => useWhichModalToShow(endedBookingWithReaction, false))

    expect(result.current.modalToShow).toEqual(ModalToShow.ACHIEVEMENT)
  })

  it('should return reaction if the reaction modal should be shown and the achievement modal should not be shown', () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      achievements: [],
    })

    const { result } = renderHook(() => useWhichModalToShow(endedBookingWithoutReaction, false))

    expect(result.current.modalToShow).toEqual(ModalToShow.REACTION)
  })

  it('should return reaction if the reaction modal should be show, even if the achievement modal should be shown', () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      achievements: achievements,
    })

    const { result } = renderHook(() => useWhichModalToShow(endedBookingWithoutReaction, false))

    expect(result.current.modalToShow).toEqual(ModalToShow.REACTION)
  })

  it('should return none if the reaction and achievement both should not be shown', () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      achievements: [],
    })

    const { result } = renderHook(() => useWhichModalToShow(endedBookingWithReaction, false))

    expect(result.current.modalToShow).toEqual(ModalToShow.NONE)
  })
})

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

const achievements: AchievementResponse[] = [
  {
    id: 1,
    name: AchievementEnum.FIRST_ART_LESSON_BOOKING,
    seenDate: undefined,
    unlockedDate: new Date().toDateString(),
  },
]

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
