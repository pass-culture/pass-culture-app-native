import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import {
  BookingsResponse,
  BookingsResponseV2,
  OfferResponseV2,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import {
  addReactionsToBookings,
  addReactionsToBookingsV2,
} from 'features/reactions/helpers/addReactionsToBookings/addReactionsToBookings'
import { updateLikesCounter } from 'features/reactions/helpers/updateLikesCounter/updateLikesCounter'
import { QueryKeys } from 'libs/queryKeys'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const useReactionMutation = () => {
  const queryClient = useQueryClient()
  const { showErrorSnackBar } = useSnackBarContext()

  return useMutation({
    mutationFn: (reactionRequest: PostReactionRequest) => api.postNativeV1Reaction(reactionRequest),

    onMutate: async (reactionRequest: PostReactionRequest) => {
      const offerId = reactionRequest.reactions[0]?.offerId
      const isLike = reactionRequest.reactions[0]?.reactionType === ReactionTypeEnum.LIKE

      await queryClient.cancelQueries({ queryKey: [QueryKeys.OFFER, offerId] })
      await queryClient.cancelQueries({ queryKey: [QueryKeys.BOOKINGS] })
      await queryClient.cancelQueries({ queryKey: [QueryKeys.BOOKINGSV2] })

      const previousOfferData = queryClient.getQueryData<OfferResponseV2>([
        QueryKeys.OFFER,
        offerId,
      ])
      const previousBookingsV1 = queryClient.getQueryData<BookingsResponse>([QueryKeys.BOOKINGS])
      const previousBookingsV2 = queryClient.getQueryData<BookingsResponseV2>([
        QueryKeys.BOOKINGSV2,
      ])

      queryClient.setQueryData<OfferResponseV2 | undefined>([QueryKeys.OFFER, offerId], (old) =>
        old
          ? {
              ...old,
              reactionsCount: {
                likes: updateLikesCounter(old.reactionsCount.likes, isLike),
              },
            }
          : old
      )

      queryClient.setQueryData<BookingsResponse | undefined>([QueryKeys.BOOKINGS], (old) =>
        old
          ? {
              ...old,
              ended_bookings: addReactionsToBookings(old.ended_bookings, reactionRequest.reactions),
            }
          : old
      )

      queryClient.setQueryData<BookingsResponseV2 | undefined>([QueryKeys.BOOKINGSV2], (old) =>
        old
          ? {
              ...old,
              endedBookings: addReactionsToBookingsV2(old.endedBookings, reactionRequest.reactions),
            }
          : old
      )

      return { previousOfferData, previousBookingsV1, previousBookingsV2 }
    },

    onError: (_error, reactionRequest, context) => {
      const offerId = reactionRequest.reactions[0]?.offerId
      queryClient.setQueryData([QueryKeys.OFFER, offerId], context?.previousOfferData)
      queryClient.setQueryData([QueryKeys.BOOKINGS], context?.previousBookingsV1)
      queryClient.setQueryData([QueryKeys.BOOKINGSV2], context?.previousBookingsV2)

      showErrorSnackBar({ message: 'Une erreur s’est produite', timeout: SNACK_BAR_TIME_OUT })
    },

    onSettled: (_data, _error, reactionRequest) => {
      const offerId = reactionRequest.reactions[0]?.offerId
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OFFER, offerId] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKINGS] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKINGSV2] })
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AVAILABLE_REACTION] })
    },
  })
}
