import { UseQueryResult } from 'react-query'

import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { mockedCulturalSurveyQuestions } from 'features/culturalSurvey/fixtures/mockedCulturalSurveyQuestions'
import { useCulturalSurveyQuestions as actualUseCulturalSurveyQuestions } from 'features/culturalSurvey/useCulturalSurvey'

export const useCulturalSurveyQuestions: typeof actualUseCulturalSurveyQuestions = jest.fn(
  () =>
    ({ data: mockedCulturalSurveyQuestions, isLoading: false, isSuccess: true } as UseQueryResult<
      CulturalSurveyQuestionsResponse,
      unknown
    >)
)

interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCulturalSurveyAnswersMutation = jest.fn(({ onSuccess, onError }: Props) => {
  return { mutate: onSuccess }
})
