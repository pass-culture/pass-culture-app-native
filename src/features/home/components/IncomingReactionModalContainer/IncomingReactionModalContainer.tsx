import React, { useCallback } from 'react'

import {
  BookingResponse,
  PostOneReactionRequest,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { OfferImageBasicProps } from 'features/reactions/types'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useModal } from 'ui/components/modals/useModal'

export const IncomingReactionModalContainer = ({
  bookingsEligibleToReaction = [],
}: {
  bookingsEligibleToReaction?: Array<BookingResponse>
}) => {
  const { mutate: addReaction } = useReactionMutation()
  const { visible: reactionModalVisible, hideModal: hideReactionModal } = useModal(true)
  const mapping = useCategoryIdMapping()

  const offerImages: OfferImageBasicProps[] = bookingsEligibleToReaction.map((current) => {
    return {
      imageUrl: current.stock.offer.image?.url ?? '',
      categoryId: mapping[current.stock.offer.subcategoryId] ?? null,
    }
  })

  const firstBooking = bookingsEligibleToReaction[0]
  const reactionChoiceModalBodyType =
    bookingsEligibleToReaction.length === 1
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
    if (bookingsEligibleToReaction.length === 0) return

    if (triggerUpdate) {
      const reactions = bookingsEligibleToReaction.map((booking) => ({
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
