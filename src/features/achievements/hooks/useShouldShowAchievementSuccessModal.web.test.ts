import { AchievementEnum, AchievementResponse } from 'api/gen'
import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import { ModalDisplayState } from 'features/home/components/helpers/useBookingsReactionHelpers'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils/web'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const achievements: AchievementResponse[] = [
  {
    id: 1,
    name: AchievementEnum.FIRST_ART_LESSON_BOOKING,
    seenDate: undefined,
    unlockedDate: new Date().toDateString(),
  },
]

describe('useShouldShowAchievementSuccessModal', () => {
  it('should return shouldNotShow if there are achievements to show to the user', () => {
    mockAuthContextWithUser({ ...beneficiaryUser, achievements })

    const { result } = renderHook(useShouldShowAchievementSuccessModal)

    expect(result.current.shouldShowAchievementSuccessModal).toEqual(
      ModalDisplayState.SHOULD_NOT_SHOW
    )
  })

  it('should return an empty array if there are no achievements to show to the user', () => {
    mockAuthContextWithUser({ ...beneficiaryUser, achievements })

    const { result } = renderHook(useShouldShowAchievementSuccessModal)

    expect(result.current.achievementsToShow).toEqual([])
  })
})
