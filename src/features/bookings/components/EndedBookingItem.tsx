import React from 'react'
import styled from 'styled-components/native'

import { BookingListItemResponse } from 'api/gen'
import { BookingItemTitle } from 'features/bookings/components/BookingItemTitle'
import { EndedBookingInteractionButtons } from 'features/bookings/components/EndedBookingInteractionButtons/EndedBookingInteractionButtons'
import { EndedBookingReason } from 'features/bookings/components/EndedBookingReason/EndedBookingReason'
import { getEndedBookingDateLabel } from 'features/bookings/helpers/getEndedBookingDateLabel/getEndedBookingDateLabel'
import { getEndedBookingItemProperties } from 'features/bookings/helpers/v2/getEndedBookingItemProperties'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { analytics } from 'libs/analytics/provider'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { ShareContent } from 'libs/share/types'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
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
  const { cancellationDate, dateUsed, stock } = booking
  const { offer } = stock
  const subcategoriesMapping = useSubcategoriesMapping()
  const subcategory = subcategoriesMapping[stock.offer.subcategoryId]
  const prePopulateOffer = usePrePopulateOffer()
  const netInfo = useNetInfoContext()
  const { showErrorSnackBar } = useSnackBarContext()

  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  const { accessibilityLabel, isBookingEligibleForArchive, handlePressOffer, navigateTo } =
    getEndedBookingItemProperties({
      booking,
      categoryId: subcategory.categoryId,
      netInfo,
      prePopulateOffer,
      showErrorSnackBar,
    })

  const { share: shareOffer, shareContent } = getShareOffer({
    offer,
    utmMedium: 'ended_booking',
  })

  const pressShareOffer = async () => {
    await analytics.logShare({ type: 'Offer', from: 'endedbookings', offerId: offer.id })
    await shareOffer()
    handleShowShareOfferModal?.(shareContent)
  }

  return (
    <Container>
      <ContentContainer
        enableNavigate={!!netInfo.isConnected}
        navigateTo={navigateTo}
        onBeforeNavigate={handlePressOffer}
        accessibilityLabel={accessibilityLabel}>
        <ContentContainerGap gap={4}>
          <OfferImage imageUrl={offer.imageUrl ?? ''} categoryId={subcategory.categoryId} />
          <AttributesView>
            <BookingItemTitle title={offer.name} />
            <EndedReasonAndDate gap={1}>
              <EndedBookingReason
                booking={booking}
                isEligibleBookingsForArchiveValue={isBookingEligibleForArchive}
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
