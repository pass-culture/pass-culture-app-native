import { useMutation } from 'react-query'

import { api } from 'api/api'
import { CulturalSurveyAnswersRequest } from 'api/gen'

interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useCulturalSurveyAnswersMutation = ({ onSuccess, onError }: Props) => {
  return useMutation(
    (answers: CulturalSurveyAnswersRequest) => {
      return api.postnativev1culturalSurveyanswers(answers)
    },
    {
      onSuccess,
      onError,
    }
  )
}
