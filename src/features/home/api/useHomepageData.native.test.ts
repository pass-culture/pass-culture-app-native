import { BookingsResponseV2 } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getHomepageId, useHomepageData } from 'features/home/api/useHomepageData'
import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { UserOnboardingRole } from 'features/onboarding/enums'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('getHomepageId', () => {
  const mockConfig: CustomRemoteConfig = {
    ...DEFAULT_REMOTE_CONFIG,
    homeEntryIdGeneral: 'general-id',
    homeEntryIdBeneficiary: 'beneficiary-id',
    homeEntryIdFreeBeneficiary: 'free-beneficiary-id',
    homeEntryIdWithoutBooking: 'without-booking-id',
  }

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn())
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it.each`
    isLoggedIn | isFreeBeneficiaryOrEligible | isBeneficiary | hasBookings | onboardingRole                 | expectedHomeEntry
    ${true}    | ${false}                    | ${true}       | ${true}     | ${UserOnboardingRole.UNKNOWN}  | ${mockConfig.homeEntryIdBeneficiary}
    ${false}   | ${false}                    | ${false}      | ${false}    | ${UserOnboardingRole.EIGHTEEN} | ${mockConfig.homeEntryIdBeneficiary}
    ${true}    | ${false}                    | ${true}       | ${false}    | ${UserOnboardingRole.UNKNOWN}  | ${mockConfig.homeEntryIdWithoutBooking}
    ${false}   | ${false}                    | ${false}      | ${false}    | ${UserOnboardingRole.UNDERAGE} | ${mockConfig.homeEntryIdFreeBeneficiary}
    ${true}    | ${true}                     | ${false}      | ${false}    | ${UserOnboardingRole.UNKNOWN}  | ${mockConfig.homeEntryIdFreeBeneficiary}
    ${false}   | ${false}                    | ${false}      | ${false}    | ${UserOnboardingRole.UNKNOWN}  | ${mockConfig.homeEntryIdGeneral}
    ${true}    | ${false}                    | ${false}      | ${false}    | ${UserOnboardingRole.UNKNOWN}  | ${mockConfig.homeEntryIdGeneral}
  `(
    `should return remote config $expectedHomeEntry when isLoggedIn=$isLoggedIn, isFreeBeneficiaryOrEligible=$isFreeBeneficiaryOrEligible, isBeneficiary, hasBookings=$hasBookings, onboardingRole=$onboardingRole`,
    ({
      isLoggedIn,
      isFreeBeneficiaryOrEligible,
      isBeneficiary,
      hasBookings,
      onboardingRole,
      expectedHomeEntry,
    }: {
      isLoggedIn: boolean
      isFreeBeneficiaryOrEligible: boolean
      isBeneficiary: boolean
      hasBookings: boolean
      onboardingRole: UserOnboardingRole
      expectedHomeEntry: string
    }) => {
      const homeId = getHomepageId(
        {
          isLoggedIn,
          isFreeBeneficiaryOrEligible,
          isBeneficiary,
          hasBookings,
          onboardingRole,
        },
        mockConfig
      )

      expect(homeId).toBe(expectedHomeEntry)
    }
  )
})

describe('useHomepageModules', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', bookingsSnapV2)
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, homepageEntriesAPIResponse)
  })

  it('calls the API and returns the data', async () => {
    const { result } = renderHook(useHomepageData, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedResult = homepageList[0]

    await waitFor(() => {
      expect(result.current).toEqual(expectedResult)
    })
  })
})
