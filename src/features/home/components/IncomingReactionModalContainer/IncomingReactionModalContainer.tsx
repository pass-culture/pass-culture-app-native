import React, { useCallback } from 'react'

import { PostOneReactionRequest, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { TWENTY_FOUR_HOURS } from 'features/home/constants'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionFromEnum } from 'features/reactions/enum'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useModal } from 'ui/components/modals/useModal'

export const IncomingReactionModalContainer = () => {
  const { reactionCategories } = useRemoteConfigContext()
  const { data: bookings } = useBookings()
  const { mutate: addReaction } = useReactionMutation()
  const { visible: reactionModalVisible, hideModal: hideReactionModal } = useModal(true)
  const subcategoriesMapping = useSubcategoriesMapping()
  const now = new Date()

  const bookingsWithoutReaction =
    bookings?.ended_bookings?.filter(({ dateUsed, userReaction }) => {
      if (!dateUsed || userReaction !== null) return false

      const elapsedTime = now.getTime() - new Date(dateUsed).getTime()
      return elapsedTime > TWENTY_FOUR_HOURS
    }) ?? []

  const firstBooking = bookingsWithoutReaction[0]

  const handleSaveReaction = useCallback(
    ({ offerId, reactionType }: PostOneReactionRequest) => {
      const reactionRequest: PostReactionRequest = {
        reactions: [{ offerId, reactionType }],
      }
      addReaction(reactionRequest)
      return Promise.resolve(true)
    },
    [addReaction]
  )

  const handleCloseModal = useCallback(() => {
    if (!firstBooking) return

    addReaction({
      reactions: [
        {
          offerId: firstBooking.stock.offer.id,
          reactionType: ReactionTypeEnum.NO_REACTION,
        },
      ],
    })

    hideReactionModal()
  }, [addReaction, firstBooking, hideReactionModal])

  if (!firstBooking) return null

  const { stock, dateUsed } = firstBooking
  const { offer } = stock
  const subcategory = subcategoriesMapping[offer.subcategoryId]

  const isEligibleCategory = reactionCategories.categories.includes(subcategory.nativeCategoryId)

  if (!isEligibleCategory) return null

  return (
    <ReactionChoiceModal
      offer={offer}
      dateUsed={dateUsed ? `le ${formatToSlashedFrenchDate(dateUsed)}` : ''}
      closeModal={handleCloseModal}
      visible={reactionModalVisible}
      defaultReaction={null}
      onSave={handleSaveReaction}
      from={ReactionFromEnum.HOME}
    />
  )
}
