import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingsResponse, OfferResponseV2, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { addReactionsToBookings } from 'features/reactions/helpers/addReactionsToBookings/addReactionsToBookings'
import { updateLikesCounter } from 'features/reactions/helpers/updateLikesCounter/updateLikesCounter'
import { QueryKeys } from 'libs/queryKeys'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useReactionMutation = () => {
  const queryClient = useQueryClient()
  const { showErrorSnackBar } = useSnackBarContext()
  return useMutation(
    (reactionRequest: PostReactionRequest) => api.postNativeV1Reaction(reactionRequest),
    {
      onMutate: async (reactionRequest: PostReactionRequest) => {
        await queryClient.cancelQueries([QueryKeys.OFFER, reactionRequest.reactions[0]?.offerId])
        await queryClient.cancelQueries([QueryKeys.BOOKINGS])

        const previousOfferData = queryClient.getQueryData([
          QueryKeys.OFFER,
          reactionRequest.reactions[0]?.offerId,
        ])
        const previousBookingsData = queryClient.getQueryData([QueryKeys.BOOKINGS])

        queryClient.setQueryData<OfferResponseV2 | undefined>(
          [QueryKeys.OFFER, reactionRequest.reactions[0]?.offerId],
          (oldData) => {
            if (!oldData) return

            const currentLikes = oldData.reactionsCount.likes
            const isLike = reactionRequest.reactions[0]?.reactionType === ReactionTypeEnum.LIKE

            return {
              ...oldData,
              reactionsCount: {
                likes: updateLikesCounter(currentLikes, isLike),
              },
            }
          }
        )

        queryClient.setQueryData<BookingsResponse | undefined>([QueryKeys.BOOKINGS], (oldData) => {
          if (!oldData) return

          const updatedEndedBookings = addReactionsToBookings(
            oldData.ended_bookings,
            reactionRequest.reactions
          )

          return {
            ...oldData,
            ended_bookings: updatedEndedBookings,
          }
        })

        return { previousBookingsData, previousOfferData }
      },
      onError: (_error, reactionRequest, context) => {
        queryClient.setQueryData(
          [QueryKeys.OFFER, reactionRequest.reactions[0]?.offerId],
          context?.previousOfferData
        )
        queryClient.setQueryData([QueryKeys.BOOKINGS], context?.previousBookingsData)

        showErrorSnackBar({
          message: 'Une erreur s’est produite',
          timeout: SNACK_BAR_TIME_OUT,
        })
      },
      onSettled: (_data, _error, reactionRequest) => {
        queryClient.invalidateQueries([QueryKeys.OFFER, reactionRequest.reactions[0]?.offerId])
        queryClient.invalidateQueries([QueryKeys.BOOKINGS])
        queryClient.invalidateQueries([QueryKeys.AVAILABLE_REACTION])
      },
    }
  )
}
