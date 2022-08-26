import shuffle from 'lodash/shuffle'

import { EligibilityType, UserProfileResponse, UserRole } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserHasBookings } from 'features/bookings/helpers'
import { HomepageEntry, Tag } from 'features/home/contentful'
import { useSelectHomepageEntry } from 'features/home/selectHomepageEntry'
import { Credit, getAvailableCredit } from 'features/home/services/useAvailableCredit'
import { useUserProfileInfo } from 'features/profile/api'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'
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

jest.mock('features/bookings/api/queries', () => ({
  useBookings: jest.fn(() => ({ ended_bookings: [], ongoing_bookings: [] })),
}))

jest.mock('features/bookings/helpers')
const mockUseUserHasBookings = useUserHasBookings as jest.MockedFunction<typeof useUserHasBookings>

jest.mock('features/home/services/useAvailableCredit')
const mockGetAvailableCredit = getAvailableCredit as jest.MockedFunction<typeof getAvailableCredit>

describe('useSelectHomepageEntry', () => {
  afterEach(jest.clearAllMocks)
  it('should not return anything when no homepageEntries retrieved from contentful', () => {
    const { result } = renderHook(() => useSelectHomepageEntry())
    const homepageEntry = result.current([])
    expect(homepageEntry).toBeUndefined()
  })

  it('should return home entry corresponding to id provided', () => {
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

  describe('all users', () => {
    beforeEach(() => {
      mockedUser = defaultUser
    })

    it('should retrieve the playlist with the entryId', () => {
      const { result } = renderHook(() => useSelectHomepageEntry(entryId))
      const playlist = result.current(shuffle(allPlaylists))
      expect(playlist).toStrictEqual(entryWithId)
    })

    it('should retrieve the playlist tagged master+usergrandpublic if available', () => {
      const { result } = renderHook(useSelectHomepageEntry)
      const playlist = result.current(shuffle(allPlaylists))
      expect(playlist).toStrictEqual(entryAllMaster)
    })

    it('should retrieve the playlist tagged only master if playlist tagged usergrandpublic does not exist', () => {
      const { result } = renderHook(useSelectHomepageEntry)
      const playlists = [
        entryUnderageMaster,
        entryUnderage,
        entryAll,
        entryMaster,
        entryOther,
        entryWithId,
      ]
      expect(result.current(shuffle(playlists))).toStrictEqual(entryMaster)
    })

    it('should retrieve the playlist tagged usergrandpublic if available and no playlist tagged master', () => {
      const { result } = renderHook(useSelectHomepageEntry)
      const playlists = shuffle([entryUnderage, entryAll, entryOther, entryWithId])
      expect(result.current(playlists)).toStrictEqual(entryAll)
    })

    it('should retrieve the first playlist if no playlist tagged master or usergrandpublic', () => {
      const { result } = renderHook(useSelectHomepageEntry)
      const playlists = shuffle([entryUnderage, entryOther, entryWithId])
      expect(result.current(playlists)).toStrictEqual(playlists[0])
    })
  })
})
