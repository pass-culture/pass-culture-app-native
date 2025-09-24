import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { CulturalSurveyAnswersRequest } from 'api/gen'

interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

export const useCulturalSurveyAnswersMutation = ({ onSuccess, onError }: Props) =>
  useMutation({
    mutationFn: (answers: CulturalSurveyAnswersRequest) => {
      return api.postNativeV1CulturalSurveyAnswers(answers)
    },
    onSuccess,
    onError,
  })
