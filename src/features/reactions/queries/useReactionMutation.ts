import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from 'api/api'
import {
  BookingsListResponseV2,
  BookingsResponse,
  BookingsResponseV2,
  OfferResponseV2,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import {
  addReactionsToBookings,
  addReactionsToBookingsList,
  addReactionsToBookingsV2,
} from 'features/reactions/helpers/addReactionsToBookings/addReactionsToBookings'
import { updateLikesCounter } from 'features/reactions/helpers/updateLikesCounter/updateLikesCounter'
import { QueryKeys } from 'libs/queryKeys'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const useReactionMutation = () => {
  const queryClient = useQueryClient()

  const BOOKING_KEYS = [QueryKeys.BOOKINGS, QueryKeys.BOOKINGSV2, QueryKeys.BOOKINGSLIST]

  return useMutation({
    mutationFn: (reactionRequest: PostReactionRequest) => api.postNativeV1Reaction(reactionRequest),

    onMutate: async (reactionRequest: PostReactionRequest) => {
      const offerId = reactionRequest.reactions[0]?.offerId
      const isLike = reactionRequest.reactions[0]?.reactionType === ReactionTypeEnum.LIKE

      await queryClient.cancelQueries({ queryKey: [QueryKeys.OFFER, offerId] })
      await Promise.all(BOOKING_KEYS.map((key) => queryClient.cancelQueries({ queryKey: [key] })))

      const previousData = {
        previousOfferData: queryClient.getQueryData([QueryKeys.OFFER, offerId]),
        previousBookingsV1: queryClient.getQueryData([QueryKeys.BOOKINGS]),
        previousBookingsV2: queryClient.getQueryData([QueryKeys.BOOKINGSV2]),
        previousBookingsList: queryClient.getQueryData([QueryKeys.BOOKINGSLIST]),
      }

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

      queryClient.setQueryData<BookingsListResponseV2 | undefined>(
        [QueryKeys.BOOKINGSLIST],
        (old) =>
          old
            ? {
                ...old,
                bookings: addReactionsToBookingsList(old.bookings, reactionRequest.reactions),
              }
            : old
      )

      return previousData
    },

    onError: (_error, reactionRequest, context) => {
      const offerId = reactionRequest.reactions[0]?.offerId
      queryClient.setQueryData([QueryKeys.OFFER, offerId], context?.previousOfferData)
      queryClient.setQueryData([QueryKeys.BOOKINGS], context?.previousBookingsV1)
      queryClient.setQueryData([QueryKeys.BOOKINGSV2], context?.previousBookingsV2)
      queryClient.setQueryData([QueryKeys.BOOKINGSLIST], context?.previousBookingsList)

      showErrorSnackBar('Une erreur s’est produite')
    },

    onSettled: async (_data, _error, reactionRequest) => {
      const offerId = reactionRequest.reactions[0]?.offerId
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKeys.OFFER, offerId] }),
        queryClient.invalidateQueries({ queryKey: [QueryKeys.AVAILABLE_REACTION] }),
        ...BOOKING_KEYS.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      ])
    },
  })
}
