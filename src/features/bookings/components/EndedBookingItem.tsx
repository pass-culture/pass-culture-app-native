import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { BookingListItemResponse } from 'api/gen'
import { BookingItemTitle } from 'features/bookings/components/BookingItemTitle'
import { EndedBookingInteractionButtons } from 'features/bookings/components/EndedBookingInteractionButtons/EndedBookingInteractionButtons'
import { EndedBookingReason } from 'features/bookings/components/EndedBookingReason/EndedBookingReason'
import { expirationDateUtilsV2 } from 'features/bookings/helpers'
import { getEndedBookingDateLabel } from 'features/bookings/helpers/getEndedBookingDateLabel/getEndedBookingDateLabel'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ShareContent } from 'libs/share/types'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type Props = {
  booking: BookingListItemResponse
  handleShowReactionModal: (booking: BookingListItemResponse) => void
  handleShowShareOfferModal: (shareContent: ShareContent | null) => void
}

export const EndedBookingItem = ({
  booking,
  handleShowReactionModal,
  handleShowShareOfferModal,
}: Props) => {
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking
  const subcategoriesMapping = useSubcategoriesMapping()
  const subcategory = subcategoriesMapping[stock.offer.subcategoryId]
  const prePopulateOffer = usePrePopulateOffer()
  const netInfo = useNetInfoContext()
  const { showErrorSnackBar } = useSnackBarContext()
  const segment = useABSegment()

  const isEligibleBookingsForArchiveValue =
    expirationDateUtilsV2.isEligibleBookingsForArchive(booking)

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
    if (shouldRedirectToBooking)
      analytics.logViewedBookingPage({
        offerId: stock.offer.id,
        from: 'endedbookings',
      })
    if (isEligibleBookingsForArchiveValue) return
    if (netInfo.isConnected) {
      // We pre-populate the query-cache with the data from the search result for a smooth transition
      prePopulateOffer({
        ...offer,
        categoryId: subcategory.categoryId,
        thumbUrl: offer.imageUrl ?? '',
        name: offer.name,
        offerId: offer.id,
      })

      triggerConsultOfferLog(
        {
          offerId: offer.id,
          from: 'endedbookings',
        },
        segment
      )
    } else {
      showErrorSnackBar({
        message:
          'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }
  const { share: shareOffer, shareContent } = getShareOffer({
    offer: stock.offer,
    utmMedium: 'ended_booking',
  })

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'endedbookings', offerId: stock.offer.id })
    shareOffer()
    handleShowShareOfferModal && handleShowShareOfferModal(shareContent)
  }, [stock.offer.id, shareOffer, handleShowShareOfferModal, shareContent])

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
          <OfferImage imageUrl={stock.offer.imageUrl ?? ''} categoryId={subcategory.categoryId} />
          <AttributesView>
            <BookingItemTitle title={stock.offer.name} />
            <EndedReasonAndDate gap={1}>
              <EndedBookingReason
                booking={booking}
                isEligibleBookingsForArchiveValue={isEligibleBookingsForArchiveValue}
              />
              <StyledBodyAccentXs>{endedBookingDateLabel}</StyledBodyAccentXs>
            </EndedReasonAndDate>
          </AttributesView>
        </ContentContainerGap>
      </ContentContainer>
      <EndedBookingInteractionButtons
        booking={booking}
        handlePressShareOffer={pressShareOffer}
        handleShowReactionModal={() => handleShowReactionModal?.(booking)}
      />
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

const AttributesView = styled.View(({ theme }) => ({
  flex: 1,
  paddingRight: theme.designSystem.size.spacing.xs,
}))

const EndedReasonAndDate = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
