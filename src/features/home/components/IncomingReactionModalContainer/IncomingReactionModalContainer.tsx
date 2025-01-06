import React, { useCallback } from 'react'

import {
  BookingReponse,
  PostOneReactionRequest,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { OfferImageBasicProps } from 'features/reactions/types'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useModal } from 'ui/components/modals/useModal'

export const IncomingReactionModalContainer = ({
  bookingsWithoutReactionFromEligibleCategories = [],
}: {
  bookingsWithoutReactionFromEligibleCategories?: Array<BookingReponse>
}) => {
  const { mutate: addReaction } = useReactionMutation()
  const { visible: reactionModalVisible, hideModal: hideReactionModal } = useModal(true)
  const mapping = useCategoryIdMapping()

  const offerImages: OfferImageBasicProps[] = bookingsWithoutReactionFromEligibleCategories.map(
    (current) => {
      return {
        imageUrl: current.stock.offer.image?.url ?? '',
        categoryId: mapping[current.stock.offer.subcategoryId] ?? null,
      }
    }
  )

  const firstBooking = bookingsWithoutReactionFromEligibleCategories[0]
  const reactionChoiceModalBodyType =
    bookingsWithoutReactionFromEligibleCategories.length === 1
      ? ReactionChoiceModalBodyEnum.VALIDATION
      : ReactionChoiceModalBodyEnum.REDIRECTION

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

  const handleCloseModalWithUpdate = (triggerUpdate?: boolean) => {
    if (bookingsWithoutReactionFromEligibleCategories.length === 0) return

    if (triggerUpdate) {
      const reactions = bookingsWithoutReactionFromEligibleCategories.map((booking) => ({
        offerId: booking.stock.offer.id,
        reactionType: ReactionTypeEnum.NO_REACTION,
      }))

      addReaction({
        reactions,
      })
    }

    hideReactionModal()
  }

  if (!firstBooking) return null

  const { stock, dateUsed } = firstBooking
  const { offer } = stock

  return (
    <ReactionChoiceModal
      offer={offer}
      dateUsed={dateUsed ? `le ${formatToSlashedFrenchDate(dateUsed)}` : ''}
      closeModal={handleCloseModalWithUpdate}
      visible={reactionModalVisible}
      defaultReaction={null}
      onSave={handleSaveReaction}
      from={ReactionFromEnum.HOME}
      bodyType={reactionChoiceModalBodyType}
      offerImages={offerImages}
    />
  )
}
