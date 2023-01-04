import shuffle from 'lodash/shuffle'

import { EligibilityType, UserProfileResponse, UserRole } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserHasBookings } from 'features/bookings/api/useUserHasBookings'
import { adaptedHomepage } from 'features/home/fixtures/homepage.fixture'
import { useSelectHomepageEntry } from 'features/home/helpers/selectHomepageEntry'
import { Homepage, HomepageTag } from 'features/home/types'
import { Credit, getAvailableCredit } from 'features/user/helpers/useAvailableCredit'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { renderHook } from 'tests/utils'

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
]

jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider')
const mockUseRemoteConfigContext = useRemoteConfigContext as jest.MockedFunction<
  typeof useRemoteConfigContext
>

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('features/bookings/api', () => ({
  useBookings: jest.fn(() => ({ ended_bookings: [], ongoing_bookings: [] })),
}))

jest.mock('features/bookings/api/useUserHasBookings')
const mockUseUserHasBookings = useUserHasBookings as jest.MockedFunction<typeof useUserHasBookings>

jest.mock('features/user/helpers/useAvailableCredit')
const mockGetAvailableCredit = getAvailableCredit as jest.MockedFunction<typeof getAvailableCredit>

const defaultRemoteConfig: CustomRemoteConfig = {
  test_param: 'A',
  homeEntryIdNotConnected: 'homeEntryIdNotConnected',
  homeEntryIdGeneral: 'homeEntryIdGeneral',
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
      isLoggedIn | user                                          | hasBookings | credit                  | expectedHomepage                 | expectedHomepageName
      ${false}   | ${undefined}                                  | ${false}    | ${undefined}            | ${homeEntryNotConnected}         | ${'homeEntryNotConnected'}
      ${true}    | ${undefined}                                  | ${false}    | ${{ isExpired: false }} | ${homeEntryNotConnected}         | ${'homeEntryNotConnected'}
      ${true}    | ${{ eligibility: EligibilityType['age-18'] }} | ${false}    | ${{ isExpired: false }} | ${homeEntryWithoutBooking_18}    | ${'homeEntryWithoutBooking_18'}
      ${true}    | ${{ roles: [UserRole.BENEFICIARY] }}          | ${false}    | ${{ isExpired: false }} | ${homeEntryWithoutBooking_18}    | ${'homeEntryWithoutBooking_18'}
      ${true}    | ${{ roles: [UserRole.BENEFICIARY] }}          | ${true}     | ${{ isExpired: false }} | ${homeEntry_18}                  | ${'homeEntry_18'}
      ${true}    | ${{ roles: [UserRole.BENEFICIARY] }}          | ${true}     | ${{ isExpired: true }}  | ${homeEntryGeneral}              | ${'homeEntryGeneral'}
      ${true}    | ${{ eligibility: EligibilityType.underage }}  | ${true}     | ${{ isExpired: false }} | ${homeEntry_15_17}               | ${'homeEntry_15_17'}
      ${true}    | ${{ eligibility: EligibilityType.underage }}  | ${false}    | ${{ isExpired: false }} | ${homeEntryWithoutBooking_15_17} | ${'homeEntryWithoutBooking_15_17'}
      ${true}    | ${{ eligibility: undefined }}                 | ${false}    | ${{ isExpired: false }} | ${homeEntryGeneral}              | ${'homeEntryGeneral'}
    `(
      `should return remote config $expectedHomepageName when isLoggedIn=$isLoggedIn, user=$user, hasBookings=$hasBookings, credit=$credit`,
      ({
        isLoggedIn,
        user,
        hasBookings,
        credit,
        expectedHomepage,
      }: {
        isLoggedIn: boolean
        user: UserProfileResponse
        hasBookings: boolean
        credit: Credit
        expectedHomepage: Homepage
      }) => {
        mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn,
          user,
          setIsLoggedIn: jest.fn(),
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
        mockUseUserHasBookings.mockReturnValueOnce(hasBookings)
        mockGetAvailableCredit.mockReturnValueOnce(credit)

        const { result } = renderHook(() => useSelectHomepageEntry())
        const Homepage = result.current(shuffle(homepageEntries))

        expect(Homepage).toBe(expectedHomepage)

        mockGetAvailableCredit.mockReset()
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
