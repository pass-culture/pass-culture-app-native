import React, { useCallback } from 'react'

import {
  BookingsResponse,
  PostOneReactionRequest,
  PostReactionRequest,
  ReactionTypeEnum,
} from 'api/gen'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { filterBookingsWithoutReaction } from 'features/home/components/helpers/filterBookingsWithoutReaction/filterBookingsWithoutReaction'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { OfferImageBasicProps } from 'features/reactions/types'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useCategoryIdMapping, useSubcategoriesMapping } from 'libs/subcategories'
import { useModal } from 'ui/components/modals/useModal'

export const IncomingReactionModalContainer = ({ bookings }: { bookings: BookingsResponse }) => {
  const { reactionCategories } = useRemoteConfigContext()
  const { isCookiesListUpToDate, cookiesLastUpdate } = useIsCookiesListUpToDate()
  const isCookieConsentChecked = cookiesLastUpdate && isCookiesListUpToDate
  const { mutate: addReaction } = useReactionMutation()
  const { visible: reactionModalVisible, hideModal: hideReactionModal } = useModal(true)
  const subcategoriesMapping = useSubcategoriesMapping()
  const mapping = useCategoryIdMapping()

  const bookingsWithoutReaction =
    bookings?.ended_bookings?.filter((booking) =>
      filterBookingsWithoutReaction(booking, subcategoriesMapping, reactionCategories)
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
