import shuffle from 'lodash/shuffle'
import { UseQueryResult } from 'react-query'

import { BookingsResponse, EligibilityType, UserProfileResponse, UserRole } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { useUserHasBookings } from 'features/bookings/api/useUserHasBookings'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { useSelectHomepageEntry } from 'features/home/helpers/selectHomepageEntry'
import { Homepage, HomepageTag } from 'features/home/types'
import { UserOnboardingRole } from 'features/tutorial/enums'
import * as OnboardingRoleAPI from 'features/tutorial/helpers/useUserRoleFromOnboarding'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
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

const homeEntryNotConnected: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdNotConnected',
}
const homeEntryGeneral: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdGeneral',
}
const homeEntryWithoutBooking_18: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdWithoutBooking_18',
}
const homeEntryWithoutBooking_15_17: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdWithoutBooking_15_17',
}
const homeEntry_18: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryId_18',
}
const homeEntry_15_17: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryId_15_17',
}

const homeEntryOnboardingGeneral: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdOnboardingGeneral',
}

const homeEntryOnboardingUnderage: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdOnboardingUnderage',
}

const homeEntryOnboarding_18: Homepage = {
  ...adaptedHomepage,
  id: 'homeEntryIdOnboarding_18',
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
  homeEntryNotConnected,
  homeEntryGeneral,
  homeEntryWithoutBooking_18,
  homeEntryWithoutBooking_15_17,
  homeEntry_18,
  homeEntry_15_17,
  homeEntryOnboardingGeneral,
  homeEntryOnboardingUnderage,
  homeEntryOnboarding_18,
]

jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider')
const mockUseRemoteConfigContext = useRemoteConfigContext as jest.MockedFunction<
  typeof useRemoteConfigContext
>

jest.mock('features/auth/context/AuthContext')

jest.mock('features/bookings/api', () => ({
  useBookings: jest.fn(() => ({ ended_bookings: [], ongoing_bookings: [] })),
}))

jest.mock('features/bookings/api/useUserHasBookings')
const mockUseUserHasBookings = useUserHasBookings as jest.MockedFunction<typeof useUserHasBookings>

jest.mock('features/bookings/api')
const mockUseBookings = useBookings as jest.MockedFunction<typeof useBookings>
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
  homeEntryIdNotConnected: 'homeEntryIdNotConnected',
  homeEntryIdGeneral: 'homeEntryIdGeneral',
  homeEntryIdOnboardingGeneral: 'homeEntryIdOnboardingGeneral',
  homeEntryIdOnboardingUnderage: 'homeEntryIdOnboardingUnderage',
  homeEntryIdOnboarding_18: 'homeEntryIdOnboarding_18',
  homeEntryIdWithoutBooking_18: 'homeEntryIdWithoutBooking_18',
  homeEntryIdWithoutBooking_15_17: 'homeEntryIdWithoutBooking_15_17',
  homeEntryId_18: 'homeEntryId_18',
  homeEntryId_15_17: 'homeEntryId_15_17',
}

describe('useSelectHomepageEntry', () => {
  it('should not return anything when no homepageEntries retrieved from contentful', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    const { result } = renderHook(() => useSelectHomepageEntry())
    const Homepage = result.current([])

    expect(Homepage).toBeUndefined()
  })

  it('should return home entry corresponding to id provided', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    const { result } = renderHook(() => useSelectHomepageEntry(homeEntryId))
    const Homepage = result.current(shuffle(homepageEntries))

    expect(Homepage).toBe(homeEntryWithId)
  })

  describe('remote config entry', () => {
    it.each`
      onboardingRole                     | expectedHomepage               | expectedHomepageName
      ${UserOnboardingRole.UNKNOWN}      | ${homeEntryNotConnected}       | ${'homeEntryNotConnected'}
      ${UserOnboardingRole.UNDERAGE}     | ${homeEntryOnboardingUnderage} | ${'homeEntryOnboardingUnderage'}
      ${UserOnboardingRole.EIGHTEEN}     | ${homeEntryOnboarding_18}      | ${'homeEntryOnboarding_18'}
      ${UserOnboardingRole.NON_ELIGIBLE} | ${homeEntryOnboardingGeneral}  | ${'homeEntryOnboardingGeneral'}
    `(
      `should return remote config $expectedHomepageName when user in not logged in, onboardingRole=$onboardingRole`,
      async ({
        onboardingRole,
        expectedHomepage,
      }: {
        onboardingRole: UserOnboardingRole
        expectedHomepage: Homepage
      }) => {
        mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
        mockAuthContextWithoutUser()
        mockUseUserRoleFromOnboarding.mockReturnValueOnce(onboardingRole)
        mockUseUserHasBookings.mockReturnValueOnce(false)

        const { result } = renderHook(() => useSelectHomepageEntry())
        const Homepage = result.current(shuffle(homepageEntries))

        await waitFor(() => {
          expect(Homepage).toBe(expectedHomepage)
        })
      }
    )

    it('should return not connected home entry when user is logged in but undefined', () => {
      mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: undefined,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
      mockUseUserRoleFromOnboarding.mockReturnValueOnce(UserOnboardingRole.UNKNOWN)
      mockUseUserHasBookings.mockReturnValueOnce(false)

      const { result } = renderHook(() => useSelectHomepageEntry())
      const Homepage = result.current(shuffle(homepageEntries))

      expect(Homepage).toBe(homeEntryNotConnected)
    })

    it.each`
      user                                         | onboardingRole                 | hasBookings | credit              | expectedHomepage                 | expectedHomepageName
      ${{ roles: [UserRole.BENEFICIARY] }}         | ${UserOnboardingRole.EIGHTEEN} | ${true}     | ${notExpiredCredit} | ${homeEntry_18}                  | ${'homeEntry_18'}
      ${{ roles: [UserRole.BENEFICIARY] }}         | ${UserOnboardingRole.EIGHTEEN} | ${true}     | ${expiredCredit}    | ${homeEntryGeneral}              | ${'homeEntryGeneral'}
      ${{ eligibility: EligibilityType.underage }} | ${UserOnboardingRole.UNDERAGE} | ${true}     | ${notExpiredCredit} | ${homeEntry_15_17}               | ${'homeEntry_15_17'}
      ${{ eligibility: EligibilityType.underage }} | ${UserOnboardingRole.UNDERAGE} | ${false}    | ${notExpiredCredit} | ${homeEntryWithoutBooking_15_17} | ${'homeEntryWithoutBooking_15_17'}
      ${{ eligibility: undefined }}                | ${UserOnboardingRole.UNKNOWN}  | ${false}    | ${notExpiredCredit} | ${homeEntryGeneral}              | ${'homeEntryGeneral'}
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
        mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
        mockAuthContextWithUser(user)

        mockUseUserRoleFromOnboarding.mockReturnValueOnce(onboardingRole)
        mockUseUserHasBookings.mockReturnValueOnce(hasBookings)
        mockGetAvailableCredit.mockReturnValueOnce(credit)

        const { result } = renderHook(() => useSelectHomepageEntry())
        const Homepage = result.current(shuffle(homepageEntries))

        await waitFor(() => {
          expect(Homepage).toBe(expectedHomepage)
        })

        mockGetAvailableCredit.mockReset()
      }
    )

    it.each`
      user
      ${{ eligibility: EligibilityType['age-18'] }}
      ${{ roles: [UserRole.BENEFICIARY] }}
    `(
      'should display the homeEntryWithoutBooking_18 home if user has never done booking as an eighteen years old',
      async ({ user }) => {
        mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: true,
          user: user as UserProfileResponse,
          setIsLoggedIn: jest.fn(),
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
        mockUseUserHasBookings.mockReturnValueOnce(true)
        mockGetAvailableCredit.mockReturnValueOnce({ isExpired: false, amount: 100 })

        mockUseBookings.mockReturnValueOnce({
          data: { ...bookingsSnap, hasBookingsAfter18: false },
          isLoading: false,
          isFetching: false,
        } as unknown as UseQueryResult<BookingsResponse, unknown>)

        const { result } = renderHook(() => useSelectHomepageEntry())
        const Homepage = result.current(shuffle(homepageEntries))

        await waitFor(() => {
          expect(Homepage).toBe(homeEntryWithoutBooking_18)
        })
      }
    )
  })

  describe('default home entry when no remote config available', () => {
    beforeEach(() => {
      mockUseRemoteConfigContext.mockReturnValueOnce({
        ...defaultRemoteConfig,
        test_param: 'A',
        homeEntryIdNotConnected: '',
        homeEntryIdGeneral: '',
        homeEntryIdWithoutBooking_18: '',
        homeEntryIdWithoutBooking_15_17: '',
        homeEntryId_18: '',
        homeEntryId_15_17: '',
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
