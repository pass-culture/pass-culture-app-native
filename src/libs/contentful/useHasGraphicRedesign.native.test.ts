import { UserProfileResponse } from 'api/gen'
import { IAuthContext } from 'features/auth/context/AuthContext'
import { beneficiaryUser } from 'fixtures/user'
import { useHasGraphicRedesign } from 'libs/contentful/useHasGraphicRedesign'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { renderHook } from 'tests/utils'

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

const defaultAuthContext: IAuthContext = {
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
}

const defaultLoggedInUser: UserProfileResponse | IAuthContext = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  isUserLoading: false,
  refetchUser: jest.fn(),
  user: {
    ...beneficiaryUser,
    depositExpirationDate: `${new Date()}`,
  },
}

let mockAuthContext = defaultAuthContext
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => mockAuthContext),
}))

describe('useHasGraphicRedesign', () => {
  describe('When shouldApplyGraphicRedesign remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: false,
      })
    })

    beforeEach(() => {
      mockAuthContext = defaultLoggedInUser
    })

    it('should return false when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(false)
    })

    it('should return false when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is false', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: false, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(false)
    })

    it('should return true when homeId is not in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: 'test' })
      )

      expect(result.current).toEqual(true)
    })

    it('should return true when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true and user is not beneficiary', () => {
      mockAuthContext = defaultAuthContext

      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(true)
    })
  })

  describe('When shouldApplyGraphicRedesign remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldApplyGraphicRedesign: true,
      })
    })

    beforeEach(() => {
      mockAuthContext = defaultLoggedInUser
    })

    it('should return true when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(true)
    })

    it('should return false when homeId is in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is false', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: false, homeId: '4XbgmX7fVVgBMoCJiLiY9n' })
      )

      expect(result.current).toEqual(false)
    })

    it('should return true when homeId is not in REDESIGN_AB_TESTING_HOME_MODULES and isFeatureFlagActive is true', () => {
      const { result } = renderHook(() =>
        useHasGraphicRedesign({ isFeatureFlagActive: true, homeId: 'test' })
      )

      expect(result.current).toEqual(true)
    })
  })
})
