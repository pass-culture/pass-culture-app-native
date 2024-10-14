import { useMutation, useQueryClient } from 'react-query'

import { api } from 'api/api'
import { PostReactionRequest } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useReactionMutation = (offerId?: number) => {
  const queryClient = useQueryClient()
  const { showErrorSnackBar } = useSnackBarContext()
  return useMutation(
    (reactionRequest: PostReactionRequest) => api.postNativeV1Reaction(reactionRequest),
    {
      onSuccess: () => {
        if (offerId) queryClient.invalidateQueries([QueryKeys.OFFER, offerId])
        queryClient.invalidateQueries([QueryKeys.BOOKINGS])
      },
      onError: () => {
        showErrorSnackBar({
          message: 'Une erreur s’est produite',
          timeout: SNACK_BAR_TIME_OUT,
        })
      },
    }
  )
}
