import React, { useCallback } from 'react'

import { PostOneReactionRequest, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { filterBookingsWithoutReaction } from 'features/home/components/helpers/filterBookingsWithoutReaction/filterBookingsWithoutReaction'
import { useAvailableReaction } from 'features/reactions/api/useAvailableReaction'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { OfferImageBasicProps } from 'features/reactions/types'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useCategoryIdMapping } from 'libs/subcategories'
import { useModal } from 'ui/components/modals/useModal'

export const IncomingReactionModalContainer = () => {
  const { isCookiesListUpToDate, cookiesLastUpdate } = useIsCookiesListUpToDate()
  const isCookieConsentChecked = cookiesLastUpdate && isCookiesListUpToDate
  const { data: bookings } = useBookings()
  const { mutate: addReaction } = useReactionMutation()
  const { visible: reactionModalVisible, hideModal: hideReactionModal } = useModal(true)
  const mapping = useCategoryIdMapping()
  const { data: availableReactions } = useAvailableReaction()

  const bookingsWithoutReaction =
    bookings?.ended_bookings?.filter((booking) =>
      filterBookingsWithoutReaction(booking, availableReactions?.bookings)
    ) ?? []

  const offerImages: OfferImageBasicProps[] = bookingsWithoutReaction.map((current) => {
    return {
      imageUrl: current.stock.offer.image?.url ?? '',
      categoryId: mapping[current.stock.offer.subcategoryId] ?? null,
    }
  })

  const firstBooking = bookingsWithoutReaction[0]
  const reactionChoiceModalBodyType =
    bookingsWithoutReaction.length === 1
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
    if (bookingsWithoutReaction.length === 0) return

    if (triggerUpdate) {
      const reactions = bookingsWithoutReaction.map((booking) => ({
        offerId: booking.stock.offer.id,
        reactionType: ReactionTypeEnum.NO_REACTION,
      }))

      addReaction({
        reactions,
      })
    }

    hideReactionModal()
  }

  if (!firstBooking || !isCookieConsentChecked) return null

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
