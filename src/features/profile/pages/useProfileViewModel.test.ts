import mockdate from 'mockdate'

import * as Auth from 'features/auth/context/AuthContext'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { initialFavoritesState } from 'features/favorites/context/reducer'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import {
  GeoCoordinates,
  GeolocPermissionState,
  GeolocPositionError,
  GeolocationError,
} from 'libs/location/location'
import { act, renderHook } from 'tests/utils'
import * as useVersion from 'ui/hooks/useVersion'

import { useProfileViewModel } from './useProfileViewModel'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockedUseAuthContext = jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  isLoggedIn: true,
  user: nonBeneficiaryUser,
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}) as jest.Mock

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut),
}))

const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates | null
const mockPositionError = null as GeolocationError | null
const mockRequestGeolocPermission = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()

const mockUseLocation = jest.fn(() => ({
  permissionState: GeolocPermissionState.GRANTED,
  geolocPosition: DEFAULT_POSITION,
  geolocPositionError: mockPositionError,
  requestGeolocPermission: mockRequestGeolocPermission,
  showGeolocPermissionModal: mockShowGeolocPermissionModal,
}))
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const mockFavoritesState = initialFavoritesState
const mockFavoriteDispatch = jest.fn()
jest.mock('features/favorites/context/FavoritesWrapper', () => ({
  useFavoritesState: () => ({
    ...mockFavoritesState,
    dispatch: mockFavoriteDispatch,
  }),
}))

jest.spyOn(useVersion, 'useVersion').mockReturnValue('Version\u00A01.10.5')

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

jest.mock('features/share/helpers/shareApp', () => ({
  shareApp: jest.fn(),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

describe('useProfileViewModel', () => {
  beforeAll(() => {
    mockdate.set(new Date(CURRENT_DATE))
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        displayInAppFeedback: true,
      },
    })
  })

  afterAll(() => {
    mockdate.reset()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    setFeatureFlags([])
  })

  describe('User and auth', () => {
    it('should expose user info when logged in', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: beneficiaryUser,
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.user).toEqual(beneficiaryUser)
      expect(result.current.userAge).toBeDefined()
    })

    it('should expose logged out state', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: false,
        user: undefined,
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isLoggedIn).toBe(false)
      expect(result.current.user).toBeUndefined()
    })

    it('should expose signOut function', () => {
      const { result } = renderHook(useProfileViewModel)

      expect(result.current.signOut).toBe(mockSignOut)
    })
  })

  describe('Geolocation', () => {
    it('should set geolocation switch active when permission is granted', () => {
      mockUseLocation.mockReturnValueOnce({
        permissionState: GeolocPermissionState.GRANTED,
        geolocPosition: DEFAULT_POSITION,
        geolocPositionError: null,
        requestGeolocPermission: mockRequestGeolocPermission,
        showGeolocPermissionModal: mockShowGeolocPermissionModal,
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isGeolocSwitchActive).toBe(true)
    })

    it('should set geolocation switch inactive when permission is denied', () => {
      mockUseLocation.mockReturnValueOnce({
        permissionState: GeolocPermissionState.DENIED,
        geolocPosition: null,
        geolocPositionError: null,
        requestGeolocPermission: mockRequestGeolocPermission,
        showGeolocPermissionModal: mockShowGeolocPermissionModal,
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isGeolocSwitchActive).toBe(false)
    })

    it('should expose geolocation error', () => {
      const mockError = {
        type: GeolocPositionError.TIMEOUT,
        message: 'Timeout error',
      } as GeolocationError
      mockUseLocation.mockReturnValueOnce({
        permissionState: GeolocPermissionState.GRANTED,
        geolocPosition: null,
        geolocPositionError: mockError,
        requestGeolocPermission: mockRequestGeolocPermission,
        showGeolocPermissionModal: mockShowGeolocPermissionModal,
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.geolocPositionError).toEqual(mockError)
    })
  })

  describe('Computed values', () => {
    it('should compute isCreditEmpty correctly when credit is 0', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: { ...beneficiaryUser, domainsCredit: { all: { initial: 300, remaining: 0 } } },
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isCreditEmpty).toBe(true)
    })

    it('should compute isCreditEmpty correctly when credit is available', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: beneficiaryUser,
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isCreditEmpty).toBe(false)
    })

    it('should compute isDepositExpired correctly when deposit is expired', () => {
      const yesterday = new Date(CURRENT_DATE)
      yesterday.setDate(yesterday.getDate() - 1)

      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: { ...beneficiaryUser, depositExpirationDate: yesterday.toISOString() },
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isDepositExpired).toBe(true)
    })

    it('should compute isDepositExpired correctly when deposit is not expired', () => {
      const tomorrow = new Date(CURRENT_DATE)
      tomorrow.setDate(tomorrow.getDate() + 1)

      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: { ...beneficiaryUser, depositExpirationDate: tomorrow.toISOString() },
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.isDepositExpired).toBe(false)
    })

    it('should show tutorial for non-beneficiary users', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: { ...nonBeneficiaryUser, isBeneficiary: false },
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.shouldDisplayTutorial).toBeTruthy()
    })

    it('should show achievements section for beneficiary users', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: { ...beneficiaryUser, isBeneficiary: true },
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.shouldShowAchievementsSection).toBe(true)
    })

    it('should not show achievements section for non-beneficiary users', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: { ...nonBeneficiaryUser, isBeneficiary: false },
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      expect(result.current.shouldShowAchievementsSection).toBe(false)
    })
  })

  describe('UI handlers', () => {
    it('should toggle geolocation and log analytics', async () => {
      mockUseLocation.mockReturnValueOnce({
        permissionState: GeolocPermissionState.GRANTED,
        geolocPosition: DEFAULT_POSITION,
        geolocPositionError: null,
        requestGeolocPermission: mockRequestGeolocPermission,
        showGeolocPermissionModal: mockShowGeolocPermissionModal,
      })

      const { result } = renderHook(useProfileViewModel)

      await act(async () => {
        result.current.toggleGeolocation()
      })

      expect(mockShowGeolocPermissionModal).toHaveBeenCalledWith()
    })

    it('should log consult tutorial analytics', () => {
      mockedUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        user: { ...beneficiaryUser, birthDate: '2000-01-01' },
        isUserLoading: false,
        refetchUser: jest.fn(),
        setIsLoggedIn: jest.fn(),
      })

      const { result } = renderHook(useProfileViewModel)

      act(() => {
        result.current.onConsultTutorial()
      })

      expect(analytics.logConsultTutorial).toHaveBeenCalledWith({
        age: expect.any(Number),
        from: 'ProfileHelp',
      })
    })

    it('should call analytics when share banner is pressed', () => {
      const { result } = renderHook(useProfileViewModel)

      act(() => {
        result.current.onShareBannerPress()
      })

      expect(analytics.logShareApp).toHaveBeenCalledWith({ from: 'profile' })
    })

    it('should call analytics when scrolled to bottom', () => {
      const { result } = renderHook(useProfileViewModel)

      act(() => {
        result.current.onScroll({
          nativeEvent: {
            layoutMeasurement: { height: 100, width: 100 },
            contentOffset: { y: 900, x: 0 },
            contentSize: { height: 1000, width: 100 },
            contentInset: { top: 0, left: 0, bottom: 0, right: 0 },
            zoomScale: 1,
          },
        })
      })

      expect(analytics.logProfilScrolledToBottom).toHaveBeenCalledWith()
    })

    it('should not call analytics when not scrolled to bottom', () => {
      const { result } = renderHook(useProfileViewModel)

      act(() => {
        result.current.onScroll({
          nativeEvent: {
            layoutMeasurement: { height: 100, width: 100 },
            contentOffset: { y: 100, x: 0 },
            contentSize: { height: 1000, width: 100 },
            contentInset: { top: 0, left: 0, bottom: 0, right: 0 },
            zoomScale: 1,
          },
        })
      })

      expect(analytics.logProfilScrolledToBottom).not.toHaveBeenCalled()
    })
  })
})
