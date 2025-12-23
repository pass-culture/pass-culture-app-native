import { AchievementEnum, AchievementResponse } from 'api/gen'
import { useShouldShowAchievementSuccessModal } from 'features/achievements/hooks/useShouldShowAchievementSuccessModal'
import { ModalDisplayState } from 'features/home/components/helpers/getBookingsReactionHelpers'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { renderHook } from 'tests/utils/web'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

const achievements: AchievementResponse[] = [
  {
    id: 1,
    name: AchievementEnum.FIRST_ART_LESSON_BOOKING,
    seenDate: undefined,
    unlockedDate: new Date().toDateString(),
  },
]

describe('useShouldShowAchievementSuccessModal', () => {
  beforeEach(() => setFeatureFlags())

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
