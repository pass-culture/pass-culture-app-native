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

describe('getHomepagId', () => {
  const mockConfig: CustomRemoteConfig = {
    ...DEFAULT_REMOTE_CONFIG,
    homeEntryIdGeneral: 'general-id',
    homeEntryIdBeneficiary: 'beneficiary-id',
    homeEntryIdFreeBeneficiary: 'free-beneficiary-id',
    homeEntryIdWithoutBooking: 'without-booking-id',
  }

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should return beneficiary home when user is logged in and beneficiary and has bookings', () => {
    const homeId = getHomepageId(
      {
        isLoggedIn: true,
        isFreeBeneficiary: false,
        isBeneficiary: true,
        hasBookings: true,
        onboardingRole: UserOnboardingRole.UNKNOWN,
      },
      mockConfig
    )
    expect(homeId).toBe(mockConfig.homeEntryIdBeneficiary)
  })

  it('should return beneficiary home when user is not logged in and onboarding role is EIGHTEEN', () => {
    const homeId = getHomepageId(
      {
        isLoggedIn: false,
        isFreeBeneficiary: false,
        isBeneficiary: false,
        hasBookings: false,
        onboardingRole: UserOnboardingRole.EIGHTEEN,
      },
      mockConfig
    )
    expect(homeId).toBe(mockConfig.homeEntryIdBeneficiary)
  })

  it('should return beneficiary "without booking" home when user is logged in, is beneficiary and has no bookings', () => {
    const homeId = getHomepageId(
      {
        isLoggedIn: true,
        isFreeBeneficiary: false,
        isBeneficiary: true,
        hasBookings: false,
        onboardingRole: UserOnboardingRole.UNKNOWN,
      },
      mockConfig
    )
    expect(homeId).toBe(mockConfig.homeEntryIdWithoutBooking)
  })

  it('should return free beneficiary home when user is not logged in and has onboarding role UNDERAGE', () => {
    const homeId = getHomepageId(
      {
        isLoggedIn: false,
        isFreeBeneficiary: false,
        isBeneficiary: false,
        hasBookings: false,
        onboardingRole: UserOnboardingRole.UNDERAGE,
      },
      mockConfig
    )
    expect(homeId).toBe(mockConfig.homeEntryIdFreeBeneficiary)
  })

  it('should return free beneficiary home when user is logged in and is free beneficiary', () => {
    const homeId = getHomepageId(
      {
        isLoggedIn: true,
        isFreeBeneficiary: true,
        isBeneficiary: false,
        hasBookings: false,
        onboardingRole: UserOnboardingRole.UNKNOWN,
      },
      mockConfig
    )
    expect(homeId).toBe(mockConfig.homeEntryIdFreeBeneficiary)
  })

  it('should return general home when user is not logged in and onboarding role is neither EIGHTEEN nor UNDERAGE', () => {
    const homeId = getHomepageId(
      {
        isLoggedIn: false,
        isFreeBeneficiary: false,
        isBeneficiary: false,
        hasBookings: false,
        onboardingRole: UserOnboardingRole.UNKNOWN,
      },
      mockConfig
    )
    expect(homeId).toBe(mockConfig.homeEntryIdGeneral)
  })

  it('should return general home when user is logged in and is neither beneficiary nor free beneficiary', () => {
    const homeId = getHomepageId(
      {
        isLoggedIn: true,
        isFreeBeneficiary: false,
        isBeneficiary: false,
        hasBookings: false,
        onboardingRole: UserOnboardingRole.UNKNOWN,
      },
      mockConfig
    )
    expect(homeId).toBe(mockConfig.homeEntryIdGeneral)
  })
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
