import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { BookingCancellationReasons } from 'api/gen'
import { BookingItemTitle } from 'features/bookings/components/BookingItemTitle'
import { isEligibleBookingsForArchive } from 'features/bookings/helpers/expirationDateUtils'
import { BookingItemProps } from 'features/bookings/types'
import { getShareOffer } from 'features/share/helpers/useShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useCategoryId } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Valid } from 'ui/svg/icons/Valid'
import { Wrong } from 'ui/svg/icons/Wrong'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const EndedBookingItem = ({ booking }: BookingItemProps) => {
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking
  const categoryId = useCategoryId(stock.offer.subcategoryId)
  const prePopulateOffer = usePrePopulateOffer()
  const netInfo = useNetInfoContext()
  const { showErrorSnackBar } = useSnackBarContext()

  const isEligibleBookingsForArchiveValue = isEligibleBookingsForArchive(booking)

  const shouldRedirectToBooking = isEligibleBookingsForArchiveValue && !cancellationReason

  const endedBookingReason = getEndedBookingReason(
    cancellationReason,
    dateUsed,
    isEligibleBookingsForArchiveValue
  )
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
        categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })

      analytics.logConsultOffer({ offerId: offer.id, from: 'endedbookings' })
    } else {
      showErrorSnackBar({
        message:
          'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { share: shareOffer, shareContent } = getShareOffer({
    offerId: stock.offer.id,
    offerName: stock.offer.name,
    venueName: stock.offer.venue.name,
  })

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'endedbookings', id: stock.offer.id })
    shareOffer()
    showShareOfferModal()
  }, [stock.offer.id, shareOffer, showShareOfferModal])

  return (
    <React.Fragment>
      <ContentContainer
        enableNavigate={!!netInfo.isConnected}
        navigateTo={
          shouldRedirectToBooking
            ? { screen: 'BookingDetails', params: { id: booking.id } }
            : { screen: 'Offer', params: { id: stock.offer.id, from: 'endedbookings' } }
        }
        onBeforeNavigate={handlePressOffer}
        accessibilityLabel={accessibilityLabel}>
        <OfferImage imageUrl={stock.offer.image?.url} categoryId={categoryId} />
        <Spacer.Row numberOfSpaces={4} />
        <AttributesView>
          <BookingItemTitle title={stock.offer.name} />
          <EndedReasonAndDate>
            {endedBookingReason}
            <Spacer.Row numberOfSpaces={1} />
            <Typo.CaptionNeutralInfo>{endedBookingDateLabel}</Typo.CaptionNeutralInfo>
          </EndedReasonAndDate>
        </AttributesView>
      </ContentContainer>
      <ShareContainer>
        <RoundedButton
          iconName="share"
          onPress={pressShareOffer}
          accessibilityLabel={`Partager l’offre ${stock.offer.name}`}
        />
      </ShareContainer>
      {!!shareContent && (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      )}
    </React.Fragment>
  )
}

const ContentContainer = styled(InternalTouchableLink)(({ theme }) => ({
  flexDirection: 'row',
  paddingRight: theme.buttons.roundedButton.size,
}))

const AttributesView = styled.View({
  flex: 1,
  paddingRight: getSpacing(1),
})

const EndedReasonAndDate = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
})

function getEndedBookingReason(
  cancellationReason?: BookingCancellationReasons | null,
  dateUsed?: string | null,
  isEligibleBookingsForArchiveValue?: boolean
) {
  if (dateUsed) {
    return <StyledInputRule title="Réservation utilisée" icon={Valid} type="Valid" noFullWidth />
  }

  if (cancellationReason === BookingCancellationReasons.OFFERER) {
    return <StyledInputRule title="Annulée" icon={Wrong} type="Error" noFullWidth />
  }

  if (!!isEligibleBookingsForArchiveValue && !cancellationReason) {
    return <StyledInputRule title="Réservation archivée" icon={Valid} type="Valid" noFullWidth />
  }

  return <StyledInputRule title="Réservation annulée" icon={Wrong} type="Error" noFullWidth />
}

function getEndedBookingDateLabel(cancellationDate?: string | null, dateUsed?: string | null) {
  const endDate = dateUsed ?? cancellationDate
  if (endDate) return `le ${formatToSlashedFrenchDate(endDate)}`
  return null
}

const StyledInputRule = styled(InputRule).attrs(({ theme }) => ({
  iconSize: theme.icons.sizes.smaller,
}))``

const ShareContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  borderRadius: theme.buttons.roundedButton.size,
}))
