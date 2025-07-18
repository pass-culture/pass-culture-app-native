import { UseQueryResult } from '@tanstack/react-query'
import { shuffle } from 'lodash'

import { BookingsResponse, EligibilityType, UserProfileResponse, UserRole } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures'
import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { useSelectHomepageEntry } from 'features/home/helpers/selectHomepageEntry'
import { Homepage, HomepageTag } from 'features/home/types'
import { UserOnboardingRole } from 'features/onboarding/enums'
import * as OnboardingRoleAPI from 'features/onboarding/helpers/useUserRoleFromOnboarding'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { useBookingsQuery, useUserHasBookingsQuery } from 'queries/bookings'
import { Credit, getAvailableCredit } from 'shared/user/useAvailableCredit'
import {
  mockAuthContextWithoutUser,
  mockAuthContextWithUser,
  mockUseAuthContext,
} from 'tests/AuthContextUtils'
import { renderHook, waitFor } from 'tests/utils'

const masterTag: HomepageTag = 'master'
const grandpublicTag: HomepageTag = 'usergrandpublic'
const underageTag: HomepageTag = 'userunderage'

const homeEntryId = 'homeEntryId'

const homeEntryWithId: Homepage = {
  ...adaptedHomepage,
  id: homeEntryId,
}
const homeEntryUnderage: Homepage = {
  ...adaptedHomepage,
  tags: [underageTag],
}
const homeEntryUnderageMaster: Homepage = {
  ...adaptedHomepage,
  tags: [masterTag, underageTag],
}
const homeEntryAll: Homepage = {
  ...adaptedHomepage,
  tags: [grandpublicTag],
}
const homeEntryAllMaster: Homepage = {
  ...adaptedHomepage,
  tags: [masterTag, grandpublicTag],
}
const homeEntryMaster: Homepage = {
  ...adaptedHomepage,
  tags: [masterTag],
}

const homeEntryGeneral: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdGeneral',
}
const homeEntryWithoutBooking: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdWithoutBooking',
}
const homeEntryBeneficiary: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdBeneficiary',
}
const homeEntryFreeBeneficiary: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdFreeBeneficiary',
}
const expiredCredit: Credit = { isExpired: true, amount: 100 }
const notExpiredCredit: Credit = { isExpired: false, amount: 100 }

const homepageEntries = [
  homeEntryUnderageMaster,
  homeEntryUnderage,
  homeEntryAll,
  homeEntryAllMaster,
  homeEntryMaster,
  adaptedHomepage,
  homeEntryWithId,
  homeEntryGeneral,
  homeEntryWithoutBooking,
  homeEntryWithoutBooking,
  homeEntryFreeBeneficiary,
  homeEntryBeneficiary,
]

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

jest.mock('features/auth/context/AuthContext')

jest.mock('queries/bookings')
const useUserHasBookings = useUserHasBookingsQuery as jest.MockedFunction<
  typeof useUserHasBookingsQuery
>

const mockedUseUserHasBookings = (useUserHasBookings as jest.Mock).mockReturnValue(true)

jest.mock('queries/bookings/useBookingsQuery')
const mockUseBookings = useBookingsQuery as jest.MockedFunction<typeof useBookingsQuery>
mockUseBookings.mockReturnValue({
  data: bookingsSnap,
  isLoading: false,
  isFetching: false,
} as unknown as UseQueryResult<BookingsResponse, unknown>)

jest.mock('shared/user/useAvailableCredit')
const mockGetAvailableCredit = getAvailableCredit as jest.MockedFunction<typeof getAvailableCredit>

const mockUseUserRoleFromOnboarding = jest.spyOn(OnboardingRoleAPI, 'useUserRoleFromOnboarding')

const defaultRemoteConfig: CustomRemoteConfig = {
  ...DEFAULT_REMOTE_CONFIG,
  homeEntryIdFreeOffers: 'homeEntryIdFreeOffers',
  homeEntryIdGeneral: 'homeEntryIdGeneral',
  homeEntryIdBeneficiary: 'homeEntryIdBeneficiary',
  homeEntryIdFreeBeneficiary: 'homeEntryIdFreeBeneficiary',
  homeEntryIdWithoutBooking: 'homeEntryIdWithoutBooking',
}

describe('useSelectHomepageEntry', () => {
  it('should not return anything when no homepageEntries retrieved from contentful', () => {
    useRemoteConfigSpy.mockReturnValueOnce(defaultRemoteConfig)
    const { result } = renderHook(() => useSelectHomepageEntry())
    const Homepage = result.current([])

    expect(Homepage).toBeUndefined()
  })

  it('should return home entry corresponding to id provided', () => {
    useRemoteConfigSpy.mockReturnValueOnce(defaultRemoteConfig)
    const { result } = renderHook(() => useSelectHomepageEntry(homeEntryId))
    const Homepage = result.current(shuffle(homepageEntries))

    expect(Homepage).toBe(homeEntryWithId)
  })

  describe('remote config entry', () => {
    it.each`
      onboardingRole                     | expectedHomepage            | expectedHomepageName
      ${UserOnboardingRole.UNDERAGE}     | ${homeEntryFreeBeneficiary} | ${'homeEntryIdFreeBeneficiary'}
      ${UserOnboardingRole.EIGHTEEN}     | ${homeEntryBeneficiary}     | ${'homeEntryBeneficiary'}
      ${UserOnboardingRole.NON_ELIGIBLE} | ${homeEntryGeneral}         | ${'homeEntryIdGeneral'}
    `(
      `should return remote config $expectedHomepageName when user in not logged in, onboardingRole=$onboardingRole`,
      async ({
        onboardingRole,
        expectedHomepage,
      }: {
        onboardingRole: UserOnboardingRole
        expectedHomepage: Homepage
      }) => {
        useRemoteConfigSpy.mockReturnValueOnce(defaultRemoteConfig)
        mockAuthContextWithoutUser()
        mockUseUserRoleFromOnboarding.mockReturnValueOnce(onboardingRole)
        mockedUseUserHasBookings.mockReturnValueOnce(false)

        const { result } = renderHook(() => useSelectHomepageEntry())
        const Homepage = result.current(shuffle(homepageEntries))

        await waitFor(() => {
          expect(Homepage).toBe(expectedHomepage)
        })
      }
    )

    it('should return general home entry when user is logged in but undefined', () => {
      useRemoteConfigSpy.mockReturnValueOnce(defaultRemoteConfig)
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: undefined,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
      mockedUseUserHasBookings.mockReturnValueOnce(true)
      const { result } = renderHook(() => useSelectHomepageEntry())
      const Homepage = result.current(shuffle(homepageEntries))

      expect(Homepage).toBe(homeEntryGeneral)
    })

    it.each`
      user                                                                                     | onboardingRole                 | hasBookings | credit              | expectedHomepage            | expectedHomepageName
      ${{ roles: [UserRole.BENEFICIARY], eligibility: EligibilityType['age-17-18'] }}          | ${UserOnboardingRole.EIGHTEEN} | ${true}     | ${notExpiredCredit} | ${homeEntryBeneficiary}     | ${'homeEntryBeneficiary'}
      ${{ roles: [UserRole.BENEFICIARY], eligibility: EligibilityType['age-17-18'] }}          | ${UserOnboardingRole.EIGHTEEN} | ${true}     | ${expiredCredit}    | ${homeEntryBeneficiary}     | ${'homeEntryBeneficiary'}
      ${{ roles: [UserRole.BENEFICIARY], eligibility: EligibilityType['age-17-18'] }}          | ${UserOnboardingRole.EIGHTEEN} | ${false}    | ${notExpiredCredit} | ${homeEntryWithoutBooking}  | ${'homeEntryWithoutBooking'}
      ${{ roles: [UserRole.UNDERAGE_BENEFICIARY], eligibility: EligibilityType['age-17-18'] }} | ${UserOnboardingRole.UNDERAGE} | ${true}     | ${notExpiredCredit} | ${homeEntryBeneficiary}     | ${'homeEntryBeneficiary'}
      ${{ roles: [UserRole.UNDERAGE_BENEFICIARY], eligibility: EligibilityType['age-17-18'] }} | ${UserOnboardingRole.UNDERAGE} | ${false}    | ${notExpiredCredit} | ${homeEntryWithoutBooking}  | ${'homeEntryWithoutBooking'}
      ${{ roles: [UserRole.FREE_BENEFICIARY], eligibility: EligibilityType.free }}             | ${UserOnboardingRole.UNDERAGE} | ${false}    | ${notExpiredCredit} | ${homeEntryFreeBeneficiary} | ${'homeEntryFreeBeneficiary'}
      ${{ eligibility: undefined }}                                                            | ${UserOnboardingRole.UNKNOWN}  | ${false}    | ${notExpiredCredit} | ${homeEntryGeneral}         | ${'homeEntryGeneral'}
    `(
      `should return remote config $expectedHomepageName when user=$user, onboardingRole=$onboardingRole, hasBookings=$hasBookings, credit=$credit`,
      async ({
        user,
        onboardingRole,
        hasBookings,
        credit,
        expectedHomepage,
      }: {
        user: UserProfileResponse
        onboardingRole: UserOnboardingRole
        hasBookings: boolean
        credit: Credit
        expectedHomepage: Homepage
      }) => {
        useRemoteConfigSpy.mockReturnValueOnce(defaultRemoteConfig)
        mockAuthContextWithUser(user)

        mockUseUserRoleFromOnboarding.mockReturnValueOnce(onboardingRole)
        mockedUseUserHasBookings.mockReturnValueOnce(hasBookings)
        mockGetAvailableCredit.mockReturnValueOnce(credit)

        const { result } = renderHook(() => useSelectHomepageEntry())
        const Homepage = result.current(shuffle(homepageEntries))

        await waitFor(() => {
          expect(Homepage).toBe(expectedHomepage)
        })

        mockGetAvailableCredit.mockReset()
      }
    )
  })

  describe('default home entry when no remote config available', () => {
    beforeEach(() => {
      useRemoteConfigSpy.mockReturnValueOnce({
        ...defaultRemoteConfig,
        test_param: 'A',
        homeEntryIdGeneral: '',
        homeEntryIdWithoutBooking: '',
        homeEntryIdBeneficiary: '',
        homeEntryIdFreeBeneficiary: '',
      })
    })

    describe('underage beneficiary users', () => {
      beforeEach(() => {
        const underageBeneficiaryUser = {
          roles: [UserRole.UNDERAGE_BENEFICIARY],
        } as UserProfileResponse
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: true,
          user: underageBeneficiaryUser,
          setIsLoggedIn: jest.fn(),
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
      })

      it('should retrieve the home entry tagged master+userunderage if available', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlist = result.current(shuffle(homepageEntries))

        expect(playlist).toStrictEqual(homeEntryUnderageMaster)
      })

      it('should retrieve the playlist tagged master and no usergrandpublic if no tag userunderage available', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = [
          homeEntryAll,
          homeEntryAllMaster,
          homeEntryMaster,
          adaptedHomepage,
          homeEntryWithId,
        ]

        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryMaster)
      })

      it('should retrieve the only playlist tagged master if no tag userunderage available', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = [homeEntryAll, homeEntryMaster, adaptedHomepage, homeEntryWithId]

        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryMaster)
      })

      it('should retrieve the first userunderage playlist even if no playlist tagged master', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = [homeEntryUnderage, homeEntryAll, adaptedHomepage, homeEntryWithId]

        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryUnderage)
      })

      it('should retrieve the first playlist if no playlist tagged master or userunderage', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = shuffle([homeEntryAll, adaptedHomepage, homeEntryWithId])

        expect(result.current(playlists)).toStrictEqual(playlists[0])
      })
    })

    describe.each`
      usertype            | user                                          | credit
      ${'exbeneficiary'}  | ${{ roles: [UserRole.BENEFICIARY] }}          | ${{ isExpired: true }}
      ${'beneficiary'}    | ${{ roles: [UserRole.BENEFICIARY] }}          | ${{ isExpired: false }}
      ${'eligible 18'}    | ${{ eligibility: EligibilityType['age-18'] }} | ${{ isExpired: false }}
      ${'eligible 15-17'} | ${{ eligibility: EligibilityType.underage }}  | ${{ isExpired: false }}
      ${'general'}        | ${{ eligibility: undefined }}                 | ${{ isExpired: false }}
    `('$usertype users', ({ user, credit }: { user: UserProfileResponse; credit: Credit }) => {
      beforeEach(() => {
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: true,
          user,
          setIsLoggedIn: jest.fn(),
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
        mockGetAvailableCredit.mockReturnValueOnce(credit)
      })

      it('should retrieve the playlist tagged master+usergrandpublic if available', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlist = result.current(shuffle(homepageEntries))

        expect(playlist).toStrictEqual(homeEntryAllMaster)
      })

      it('should retrieve the playlist tagged only master if playlist tagged usergrandpublic does not exist', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = [
          homeEntryUnderageMaster,
          homeEntryUnderage,
          homeEntryAll,
          homeEntryMaster,
          adaptedHomepage,
          homeEntryWithId,
        ]

        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryMaster)
      })

      it('should retrieve the playlist tagged usergrandpublic if available and no playlist tagged master', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = shuffle([
          homeEntryUnderage,
          homeEntryAll,
          adaptedHomepage,
          homeEntryWithId,
        ])

        expect(result.current(playlists)).toStrictEqual(homeEntryAll)
      })

      it('should retrieve the first playlist if no playlist tagged master or usergrandpublic', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = shuffle([homeEntryUnderage, adaptedHomepage, homeEntryWithId])

        expect(result.current(playlists)).toStrictEqual(playlists[0])
      })
    })
  })
})
