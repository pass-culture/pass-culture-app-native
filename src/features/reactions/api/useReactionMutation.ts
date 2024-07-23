import { useMutation } from 'react-query'

import { api } from 'api/api'
import { PostReactionRequest } from 'api/gen'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useReactionMutation = () => {
  const { showErrorSnackBar } = useSnackBarContext()
  return useMutation(
    (reactionRequest: PostReactionRequest) => api.postNativeV1Reaction(reactionRequest),
    {
      onError: () => {
        showErrorSnackBar({
          message: 'Une erreur s’est produite',
          timeout: SNACK_BAR_TIME_OUT,
        })
      },
    }
  )
}
