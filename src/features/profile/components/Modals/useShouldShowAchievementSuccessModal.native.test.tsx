import { AchievementEnum, AchievementResponse } from 'api/gen'
import { useShouldShowAchievementSuccessModal } from 'features/profile/components/Modals/useShouldShowAchievementSuccessModal'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

const achievements: AchievementResponse[] = [
  {
    name: AchievementEnum.FIRST_ART_LESSON_BOOKING,
    seenDate: undefined,
    unlockedDate: new Date().toDateString(),
  },
]

describe('useShouldShowAchievementSuccessModal', () => {
  describe('Feature Flag (enableAchievements) is false and remoteConfig (displayAchievements) is true', () => {
    beforeEach(() => {
      setFeatureFlags()
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

    it('should return false', () => {
      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeFalsy()
    })

    it('should return false even if there are achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeFalsy()
    })
  })

  describe('Feature Flag (enableAchievements) is true and remoteConfig (displayAchievements) is true', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS])
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

    it('should return false', () => {
      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeFalsy()
    })

    it('should return false if there no achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: [],
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeFalsy()
    })

    it('should return false if the achievements are undefined', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: undefined as unknown as AchievementResponse[],
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeFalsy()
    })

    it('should return an empty array if there are no achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: [],
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.achievementsToShow).toEqual([])
    })

    it('should return true if there are achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeTruthy()
    })

    it('should return an array with the names of the achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.achievementsToShow).toEqual(['FIRST_ART_LESSON_BOOKING'])
    })
  })

  describe('Feature Flag (enableAchievements) is true and remoteConfig (displayAchievements) is false', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS])
    })

    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return false', () => {
      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeFalsy()
    })

    it('should return false even if there are achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toBeFalsy()
    })

    it('should return an array even if there are achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.achievementsToShow).toEqual([])
    })
  })
})
