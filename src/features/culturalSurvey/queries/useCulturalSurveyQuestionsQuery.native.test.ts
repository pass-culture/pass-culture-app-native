import { useCulturalSurveyQuestionsQuery } from 'features/culturalSurvey/queries/useCulturalSurveyQuestionsQuery'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

describe('useCulturalSurveyQuestionQuery', () => {
  it('should only fetch data when user is logged in', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderCulturalSurveyQuestionsHook()

    await waitFor(async () => expect(result.current.isFetched).toEqual(false))
    await waitFor(async () => expect(result.current.isEnabled).toEqual(false))
  })
})

const renderCulturalSurveyQuestionsHook = () =>
  renderHook(() => useCulturalSurveyQuestionsQuery(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
