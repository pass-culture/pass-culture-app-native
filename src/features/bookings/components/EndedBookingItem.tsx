import React, { useCallback, useState } from 'react'
import styled from 'styled-components/native'

import { PostOneReactionRequest, ReactionTypeEnum } from 'api/gen'
import { BookingItemTitle } from 'features/bookings/components/BookingItemTitle'
import { EndedBookingInteractionButtons } from 'features/bookings/components/EndedBookingInteractionButtons/EndedBookingInteractionButtons'
import { EndedBookingReason } from 'features/bookings/components/EndedBookingReason/EndedBookingReason'
import { isEligibleBookingsForArchive } from 'features/bookings/helpers/expirationDateUtils'
import { getEndedBookingDateLabel } from 'features/bookings/helpers/getEndedBookingDateLabel/getEndedBookingDateLabel'
import { BookingItemProps } from 'features/bookings/types'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Typo } from 'ui/theme'

export const EndedBookingItem = ({ booking, onSaveReaction }: BookingItemProps) => {
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking
  const subcategoriesMapping = useSubcategoriesMapping()
  const subcategory = subcategoriesMapping[stock.offer.subcategoryId]
  const prePopulateOffer = usePrePopulateOffer()
  const netInfo = useNetInfoContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const shouldDisplayReactionFeature = useFeatureFlag(RemoteStoreFeatureFlags.WIP_REACTION_FEATURE)

  const [userReaction, setUserReaction] = useState<ReactionTypeEnum | null | undefined>(
    booking.userReaction
  )

  const isEligibleBookingsForArchiveValue = isEligibleBookingsForArchive(booking)

  const shouldRedirectToBooking = isEligibleBookingsForArchiveValue && !cancellationReason

  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.BOOKING, {
    name: stock.offer.name,
    dateUsed: dateUsed ? formatToSlashedFrenchDate(dateUsed) : undefined,
    cancellationDate: cancellationDate ? formatToSlashedFrenchDate(cancellationDate) : undefined,
  })

  function handlePressOffer() {
    const { offer } = stock
    if (!offer.id) return
    if (isEligibleBookingsForArchiveValue) return
    if (netInfo.isConnected) {
      // We pre-populate the query-cache with the data from the search result for a smooth transition
      prePopulateOffer({
        ...offer,
        categoryId: subcategory.categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })

      triggerConsultOfferLog({ offerId: offer.id, from: 'endedbookings' })
    } else {
      showErrorSnackBar({
        message:
          'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  const {
    visible: reactionModalVisible,
    showModal: showReactionModal,
    hideModal: hideReactionModal,
  } = useModal(false)

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { share: shareOffer, shareContent } = getShareOffer({
    offer: stock.offer,
    utmMedium: 'ended_booking',
  })

  const handleSaveReaction = async ({ offerId, reactionType }: PostOneReactionRequest) => {
    await onSaveReaction?.({ offerId, reactionType })
    setUserReaction(reactionType)
    hideReactionModal()
  }

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'endedbookings', offerId: stock.offer.id })
    shareOffer()
    showShareOfferModal()
  }, [stock.offer.id, shareOffer, showShareOfferModal])

  return (
    <Container>
      <ContentContainer
        enableNavigate={!!netInfo.isConnected}
        navigateTo={
          shouldRedirectToBooking
            ? { screen: 'BookingDetails', params: { id: booking.id } }
            : { screen: 'Offer', params: { id: stock.offer.id, from: 'endedbookings' } }
        }
        onBeforeNavigate={handlePressOffer}
        accessibilityLabel={accessibilityLabel}>
        <ContentContainerGap gap={4}>
          <OfferImage imageUrl={stock.offer.image?.url} categoryId={subcategory.categoryId} />
          <AttributesView>
            <BookingItemTitle title={stock.offer.name} />
            <EndedReasonAndDate gap={1}>
              <EndedBookingReason
                booking={booking}
                isEligibleBookingsForArchiveValue={isEligibleBookingsForArchiveValue}
              />
              <Typo.CaptionNeutralInfo>{endedBookingDateLabel}</Typo.CaptionNeutralInfo>
            </EndedReasonAndDate>
          </AttributesView>
        </ContentContainerGap>
      </ContentContainer>
      <EndedBookingInteractionButtons
        booking={booking}
        nativeCategoryId={subcategory.nativeCategoryId}
        handlePressShareOffer={pressShareOffer}
        handleShowReactionModal={showReactionModal}
        userReaction={userReaction}
      />
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
      {shouldDisplayReactionFeature ? (
        <ReactionChoiceModal
          offer={booking.stock.offer}
          dateUsed={endedBookingDateLabel ?? ''}
          closeModal={hideReactionModal}
          visible={reactionModalVisible}
          defaultReaction={userReaction}
          onSave={handleSaveReaction}
          from={ReactionFromEnum.ENDED_BOOKING}
          bodyType={ReactionChoiceModalBodyEnum.VALIDATION}
        />
      ) : null}
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const ContentContainer = styled(InternalTouchableLink)(({ theme }) => ({
  flexDirection: 'row',
  paddingRight: theme.buttons.roundedButton.size,
  flex: 1,
}))

const ContentContainerGap = styled(ViewGap)({
  flexDirection: 'row',
  flex: 1,
})

const AttributesView = styled.View({
  flex: 1,
  paddingRight: getSpacing(1),
})

const EndedReasonAndDate = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
})
