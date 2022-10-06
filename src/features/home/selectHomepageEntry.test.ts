import shuffle from 'lodash/shuffle'

import { EligibilityType, UserProfileResponse, UserRole } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserHasBookings } from 'features/bookings/api/useUserHasBookings'
import { HomepageEntry, Tag } from 'features/home/contentful'
import { useSelectHomepageEntry } from 'features/home/selectHomepageEntry'
import { Credit, getAvailableCredit } from 'features/home/services/useAvailableCredit'
import { useUserProfileInfo } from 'features/profile/api'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
import {
  CustomRemoteConfig,
  NotificationsTrigger,
} from 'libs/firebase/remoteConfig/remoteConfig.types'
import { UsePersistQueryResult } from 'libs/react-query/usePersistQuery'
import { adaptedHomepageEntry as defaultHomeEntry } from 'tests/fixtures/homepageEntries'
import { renderHook } from 'tests/utils'

const masterTag: Tag = { sys: { id: 'master', linkType: 'Tag', type: 'Link' } }
const grandpublicTag: Tag = { sys: { id: 'usergrandpublic', linkType: 'Tag', type: 'Link' } }
const underageTag: Tag = { sys: { id: 'userunderage', linkType: 'Tag', type: 'Link' } }

const homeEntryId = 'homeEntryId'

const homeEntryWithId: HomepageEntry = {
  ...defaultHomeEntry,
  sys: { ...defaultHomeEntry.sys, id: homeEntryId },
}
const homeEntryUnderage: HomepageEntry = {
  ...defaultHomeEntry,
  metadata: { tags: [underageTag] },
}
const homeEntryUnderageMaster: HomepageEntry = {
  ...defaultHomeEntry,
  metadata: { tags: [masterTag, underageTag] },
}
const homeEntryAll: HomepageEntry = { ...defaultHomeEntry, metadata: { tags: [grandpublicTag] } }
const homeEntryAllMaster: HomepageEntry = {
  ...defaultHomeEntry,
  metadata: { tags: [masterTag, grandpublicTag] },
}
const homeEntryMaster: HomepageEntry = { ...defaultHomeEntry, metadata: { tags: [masterTag] } }

const homeEntryNotConnected: HomepageEntry = {
  ...defaultHomeEntry,
  sys: { ...defaultHomeEntry.sys, id: 'homeEntryIdNotConnected' },
}
const homeEntryGeneral: HomepageEntry = {
  ...defaultHomeEntry,
  sys: { ...defaultHomeEntry.sys, id: 'homeEntryIdGeneral' },
}
const homeEntryWithoutBooking_18: HomepageEntry = {
  ...defaultHomeEntry,
  sys: { ...defaultHomeEntry.sys, id: 'homeEntryIdWithoutBooking_18' },
}
const homeEntryWithoutBooking_15_17: HomepageEntry = {
  ...defaultHomeEntry,
  sys: { ...defaultHomeEntry.sys, id: 'homeEntryIdWithoutBooking_15_17' },
}
const homeEntry_18: HomepageEntry = {
  ...defaultHomeEntry,
  sys: { ...defaultHomeEntry.sys, id: 'homeEntryId_18' },
}
const homeEntry_15_17: HomepageEntry = {
  ...defaultHomeEntry,
  sys: { ...defaultHomeEntry.sys, id: 'homeEntryId_15_17' },
}

const homepageEntries = [
  homeEntryUnderageMaster,
  homeEntryUnderage,
  homeEntryAll,
  homeEntryAllMaster,
  homeEntryMaster,
  defaultHomeEntry,
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

jest.mock('features/profile/api')
const mockUseUserProfileInfo = useUserProfileInfo as jest.MockedFunction<typeof useUserProfileInfo>

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

jest.mock('features/bookings/api', () => ({
  useBookings: jest.fn(() => ({ ended_bookings: [], ongoing_bookings: [] })),
}))

jest.mock('features/bookings/api/useUserHasBookings')
const mockUseUserHasBookings = useUserHasBookings as jest.MockedFunction<typeof useUserHasBookings>

jest.mock('features/home/services/useAvailableCredit')
const mockGetAvailableCredit = getAvailableCredit as jest.MockedFunction<typeof getAvailableCredit>

const defaultRemoteConfig: CustomRemoteConfig = {
  test_param: 'A',
  homeEntryIdNotConnected: 'homeEntryIdNotConnected',
  homeEntryIdGeneral: 'homeEntryIdGeneral',
  homeEntryIdWithoutBooking_18: 'homeEntryIdWithoutBooking_18',
  homeEntryIdWithoutBooking_15_17: 'homeEntryIdWithoutBooking_15_17',
  homeEntryId_18: 'homeEntryId_18',
  homeEntryId_15_17: 'homeEntryId_15_17',
  notificationsTrigger: NotificationsTrigger.HOME,
}

describe('useSelectHomepageEntry', () => {
  it('should not return anything when no homepageEntries retrieved from contentful', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    const { result } = renderHook(() => useSelectHomepageEntry())
    const homepageEntry = result.current([])
    expect(homepageEntry).toBeUndefined()
  })

  it('should return home entry corresponding to id provided', () => {
    mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
    const { result } = renderHook(() => useSelectHomepageEntry(homeEntryId))
    const homepageEntry = result.current(shuffle(homepageEntries))
    expect(homepageEntry).toBe(homeEntryWithId)
  })

  describe('remote config entry', () => {
    it.each`
      isLoggedIn | user                                                    | hasBookings | credit                  | expectedHomepageEntry            | expectedHomepageEntryName
      ${false}   | ${{ data: undefined }}                                  | ${false}    | ${undefined}            | ${homeEntryNotConnected}         | ${'homeEntryNotConnected'}
      ${true}    | ${{ data: undefined }}                                  | ${false}    | ${{ isExpired: false }} | ${homeEntryNotConnected}         | ${'homeEntryNotConnected'}
      ${true}    | ${{ data: { eligibility: EligibilityType['age-18'] } }} | ${false}    | ${{ isExpired: false }} | ${homeEntryWithoutBooking_18}    | ${'homeEntryWithoutBooking_18'}
      ${true}    | ${{ data: { roles: [UserRole.BENEFICIARY] } }}          | ${false}    | ${{ isExpired: false }} | ${homeEntryWithoutBooking_18}    | ${'homeEntryWithoutBooking_18'}
      ${true}    | ${{ data: { roles: [UserRole.BENEFICIARY] } }}          | ${true}     | ${{ isExpired: false }} | ${homeEntry_18}                  | ${'homeEntry_18'}
      ${true}    | ${{ data: { roles: [UserRole.BENEFICIARY] } }}          | ${true}     | ${{ isExpired: true }}  | ${homeEntryGeneral}              | ${'homeEntryGeneral'}
      ${true}    | ${{ data: { eligibility: EligibilityType.underage } }}  | ${true}     | ${{ isExpired: false }} | ${homeEntry_15_17}               | ${'homeEntry_15_17'}
      ${true}    | ${{ data: { eligibility: EligibilityType.underage } }}  | ${false}    | ${{ isExpired: false }} | ${homeEntryWithoutBooking_15_17} | ${'homeEntryWithoutBooking_15_17'}
      ${true}    | ${{ data: { eligibility: undefined } }}                 | ${false}    | ${{ isExpired: false }} | ${homeEntryGeneral}              | ${'homeEntryGeneral'}
    `(
      `should return remote config $expectedHomepageEntryName when isLoggedIn=$isLoggedIn, user=$user.data, hasBookings=$hasBookings, credit=$credit`,
      ({
        isLoggedIn,
        user,
        hasBookings,
        credit,
        expectedHomepageEntry,
      }: {
        isLoggedIn: boolean
        user: UserProfileResponse
        hasBookings: boolean
        credit: Credit
        expectedHomepageEntry: HomepageEntry
      }) => {
        mockUseRemoteConfigContext.mockReturnValueOnce(defaultRemoteConfig)
        mockUseAuthContext.mockReturnValueOnce({ isLoggedIn, setIsLoggedIn: jest.fn() })
        mockUseUserProfileInfo.mockReturnValueOnce(
          user as unknown as UsePersistQueryResult<UserProfileResponse, unknown>
        )
        mockUseUserHasBookings.mockReturnValueOnce(hasBookings)
        mockGetAvailableCredit.mockReturnValueOnce(credit)

        const { result } = renderHook(() => useSelectHomepageEntry())
        const homepageEntry = result.current(shuffle(homepageEntries))

        expect(homepageEntry).toBe(expectedHomepageEntry)

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
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, setIsLoggedIn: jest.fn() })
    })

    describe('underage beneficiary users', () => {
      beforeEach(() => {
        const underageBeneficiaryUser = { data: { roles: [UserRole.UNDERAGE_BENEFICIARY] } }
        mockUseUserProfileInfo.mockReturnValueOnce(
          underageBeneficiaryUser as unknown as UsePersistQueryResult<UserProfileResponse, unknown>
        )
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
          defaultHomeEntry,
          homeEntryWithId,
        ]
        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryMaster)
      })

      it('should retrieve the only playlist tagged master if no tag userunderage available', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = [homeEntryAll, homeEntryMaster, defaultHomeEntry, homeEntryWithId]
        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryMaster)
      })

      it('should retrieve the first userunderage playlist even if no playlist tagged master', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = [homeEntryUnderage, homeEntryAll, defaultHomeEntry, homeEntryWithId]
        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryUnderage)
      })

      it('should retrieve the first playlist if no playlist tagged master or userunderage', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = shuffle([homeEntryAll, defaultHomeEntry, homeEntryWithId])
        expect(result.current(playlists)).toStrictEqual(playlists[0])
      })
    })

    describe.each`
      usertype            | user                                                    | credit
      ${'exbeneficiary'}  | ${{ data: { roles: [UserRole.BENEFICIARY] } }}          | ${{ isExpired: true }}
      ${'beneficiary'}    | ${{ data: { roles: [UserRole.BENEFICIARY] } }}          | ${{ isExpired: false }}
      ${'eligible 18'}    | ${{ data: { eligibility: EligibilityType['age-18'] } }} | ${{ isExpired: false }}
      ${'eligible 15-17'} | ${{ data: { eligibility: EligibilityType.underage } }}  | ${{ isExpired: false }}
      ${'general'}        | ${{ data: { eligibility: undefined } }}                 | ${{ isExpired: false }}
    `('$usertype users', ({ user, credit }: { user: UserProfileResponse; credit: Credit }) => {
      beforeEach(() => {
        mockUseUserProfileInfo.mockReturnValueOnce(
          user as unknown as UsePersistQueryResult<UserProfileResponse, unknown>
        )
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
          defaultHomeEntry,
          homeEntryWithId,
        ]
        expect(result.current(shuffle(playlists))).toStrictEqual(homeEntryMaster)
      })

      it('should retrieve the playlist tagged usergrandpublic if available and no playlist tagged master', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = shuffle([
          homeEntryUnderage,
          homeEntryAll,
          defaultHomeEntry,
          homeEntryWithId,
        ])
        expect(result.current(playlists)).toStrictEqual(homeEntryAll)
      })

      it('should retrieve the first playlist if no playlist tagged master or usergrandpublic', () => {
        const { result } = renderHook(useSelectHomepageEntry)
        const playlists = shuffle([homeEntryUnderage, defaultHomeEntry, homeEntryWithId])
        expect(result.current(playlists)).toStrictEqual(playlists[0])
      })
    })
  })
})
