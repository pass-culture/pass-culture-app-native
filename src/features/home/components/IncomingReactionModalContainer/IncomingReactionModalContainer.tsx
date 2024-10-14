import React, { useCallback } from 'react'

import { PostOneReactionRequest, PostReactionRequest, ReactionTypeEnum } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { useIsCookiesListUpToDate } from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { filterBookingsWithoutReaction } from 'features/home/components/helpers/filterBookingsWithoutReaction/filterBookingsWithoutReaction'
import { useReactionMutation } from 'features/reactions/api/useReactionMutation'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionRedirectionModal } from 'features/reactions/components/ReactionRedirectionModal/ReactionRedirectionModal'
import { ReactionFromEnum } from 'features/reactions/enum'
import { OfferImageBasicProps } from 'features/reactions/types'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { useCategoryIdMapping, useSubcategoriesMapping } from 'libs/subcategories'
import { useModal } from 'ui/components/modals/useModal'

export const IncomingReactionModalContainer = () => {
  const { reactionCategories } = useRemoteConfigContext()
  const { isCookiesListUpToDate, cookiesLastUpdate } = useIsCookiesListUpToDate()
  const isCookieConsentChecked = cookiesLastUpdate && isCookiesListUpToDate
  const { data: bookings } = useBookings()
  const { mutate: addReaction } = useReactionMutation()
  const { visible: reactionChoiceModalVisible, hideModal: hideReactionChoiceModal } = useModal(true)
  const { visible: reactionRedirectionVisible, hideModal: hideRedirectionReactionModal } =
    useModal(true)
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

    if (bookingsWithoutReaction.length > 1) {
      hideRedirectionReactionModal()
    }
    hideReactionChoiceModal()
  }

  if (!firstBooking || !isCookieConsentChecked) return null

  const { stock, dateUsed } = firstBooking
  const { offer } = stock

  return (
    <React.Fragment>
      {bookingsWithoutReaction.length > 1 ? (
        <ReactionRedirectionModal
          visible={reactionRedirectionVisible}
          closeModal={handleCloseModalWithUpdate}
          offerImages={offerImages}
        />
      ) : (
        <ReactionChoiceModal
          offer={offer}
          dateUsed={dateUsed ? `le ${formatToSlashedFrenchDate(dateUsed)}` : ''}
          closeModal={handleCloseModalWithUpdate}
          visible={reactionChoiceModalVisible}
          defaultReaction={null}
          onSave={handleSaveReaction}
          from={ReactionFromEnum.HOME}
        />
      )}
    </React.Fragment>
  )
}
