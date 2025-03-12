import { AchievementEnum, AchievementResponse } from 'api/gen'
import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import { ModalDisplayState } from 'features/home/components/helpers/useBookingsReactionHelpers'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

const achievements: AchievementResponse[] = [
  {
    id: 1,
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
      useRemoteConfigSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        displayAchievements: true,
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return shouldNotShow', () => {
      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(
        ModalDisplayState.SHOULD_NOT_SHOW
      )
    })

    it('should return shouldNotShow even if there are achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(
        ModalDisplayState.SHOULD_NOT_SHOW
      )
    })
  })

  describe('Feature Flag (enableAchievements) is true and remoteConfig (displayAchievements) is true', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS])
    })

    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        displayAchievements: true,
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return shouldNotShow', () => {
      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(
        ModalDisplayState.SHOULD_NOT_SHOW
      )
    })

    it('should return shouldNotShow if there no achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: [],
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(
        ModalDisplayState.SHOULD_NOT_SHOW
      )
    })

    it('should return pending if the achievements are undefined', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: undefined as unknown as AchievementResponse[],
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(ModalDisplayState.PENDING)
    })

    it('should return an empty array if there are no achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: [],
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.achievementsToShow).toEqual([])
    })

    it('should return shouldShow if there are achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(
        ModalDisplayState.SHOULD_SHOW
      )
    })

    it('should return an array with the achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.achievementsToShow).toEqual([
        expect.objectContaining({
          id: 1,
          name: 'FIRST_ART_LESSON_BOOKING',
          seenDate: undefined,
        }),
      ])
    })
  })

  describe('Feature Flag (enableAchievements) is true and remoteConfig (displayAchievements) is false', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS])
    })

    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should return shouldNotShow', () => {
      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(
        ModalDisplayState.SHOULD_NOT_SHOW
      )
    })

    it('should return shouldNotShow even if there are achievements to show to the user', () => {
      mockAuthContextWithUser({
        ...beneficiaryUser,
        achievements: achievements,
      })

      const { result } = renderHook(useShouldShowAchievementSuccessModal)

      expect(result.current.shouldShowAchievementSuccessModal).toEqual(
        ModalDisplayState.SHOULD_NOT_SHOW
      )
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
