import { useMutation } from '@tanstack/react-query'

import { api } from 'api/api'
import { PostFeedbackBody } from 'api/gen'

type FeedbackMutationOptions = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export const useFeedbackMutation = ({ onSuccess, onError }: FeedbackMutationOptions) => {
  return useMutation((body: PostFeedbackBody) => api.postNativeV1Feedback(body), {
    onSuccess,
    onError,
  })
}
