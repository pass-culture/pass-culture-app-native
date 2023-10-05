import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { WithdrawalTypeEnum } from 'api/gen'
import { BookingItemTitle } from 'features/bookings/components/BookingItemTitle'
import { getBookingLabels, getBookingProperties } from 'features/bookings/helpers'
import {
  daysCountdown,
  displayExpirationMessage,
  isBookingInList,
} from 'features/bookings/helpers/expirationDateUtils'
import { BookingItemProps } from 'features/bookings/types'
import { getShareOffer } from 'features/share/helpers/useShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useModal } from 'ui/components/modals/useModal'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorClock as DefaultClock } from 'ui/svg/icons/BicolorClock'
import { Duo } from 'ui/svg/icons/Duo'
import { OfferEvent as DefaultOfferEvent } from 'ui/svg/icons/OfferEvent'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const OnGoingBookingItem = ({ booking, eligibleBookingsForArchive }: BookingItemProps) => {
  const daysLeft = daysCountdown(booking.dateCreated)
  const { isEvent } = useSubcategory(booking.stock.offer.subcategoryId)
  const categoryId = useCategoryId(booking.stock.offer.subcategoryId)

  const { stock } = booking
  const bookingProperties = getBookingProperties(booking, isEvent)
  const { dateLabel, withdrawLabel } = getBookingLabels(booking, bookingProperties)

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.BOOKING, {
    name: stock.offer.name,
    properties: bookingProperties,
    date: dateLabel,
  })

  const isBookingValid = isBookingInList(booking, eligibleBookingsForArchive)
  const canDisplayExpirationMessage = !!isBookingValid && daysLeft >= 0
  const correctExpirationMessages = displayExpirationMessage(daysLeft)

  const {
    visible: shareOfferModalVisible,
    showModal: showShareOfferModal,
    hideModal: hideShareOfferModal,
  } = useModal(false)

  const { share: shareOffer, shareContent } = getShareOffer({
    offerId: stock.offer.id,
    offerName: stock.offer.name,
    venueName: stock.offer.venue.name,
    utmMedium: 'booking',
  })

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'bookings', offer_id: stock.offer.id })
    shareOffer()
    showShareOfferModal()
  }, [stock.offer.id, shareOffer, showShareOfferModal])

  return (
    <React.Fragment>
      <ContentContainer
        navigateTo={{ screen: 'BookingDetails', params: { id: booking.id } }}
        accessibilityLabel={accessibilityLabel}>
        <OfferImage imageUrl={stock.offer.image?.url} categoryId={categoryId} size="tall" />
        <AttributesView>
          <BookingItemTitle title={stock.offer.name} />
          {!!dateLabel && <DateLabel>{dateLabel}</DateLabel>}
          {!!bookingProperties.isDuo && <Duo />}
          <Spacer.Flex />
          {!!withdrawLabel && (
            <React.Fragment>
              {stock.offer.withdrawalType === WithdrawalTypeEnum.on_site ? (
                <WithdrawContainer testID="on-site-withdrawal-container">
                  <OfferEvent />
                  <Spacer.Row numberOfSpaces={1} />
                  <OnSiteWithdrawalCaption numberOfLines={2}>
                    {withdrawLabel}
                  </OnSiteWithdrawalCaption>
                </WithdrawContainer>
              ) : (
                <WithdrawContainer testID="withdraw-container">
                  <Clock />
                  <Spacer.Row numberOfSpaces={1} />
                  <WithdrawCaption numberOfLines={2}>{withdrawLabel}</WithdrawCaption>
                </WithdrawContainer>
              )}
            </React.Fragment>
          )}
          {!!canDisplayExpirationMessage && (
            <ExpirationBookingContainer testID="expiration-booking-container">
              <Clock />
              <Spacer.Row numberOfSpaces={1} />
              <ExpirationBookingLabel>{correctExpirationMessages}</ExpirationBookingLabel>
            </ExpirationBookingContainer>
          )}
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
  marginHorizontal: getSpacing(6),
  flexDirection: 'row',
  paddingRight: theme.buttons.roundedButton.size,
}))

const AttributesView = styled.View({
  flex: 1,
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(1),
})

const WithdrawContainer = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  color: theme.colors.primary,
}))

const DateLabel = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const WithdrawCaption = styled(Typo.Caption)({
  marginRight: getSpacing(4),
})

const OnSiteWithdrawalCaption = styled(WithdrawCaption)(({ theme }) => ({
  color: theme.colors.primary,
}))

const Clock = styled(DefaultClock).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))``

const OfferEvent = styled(DefaultOfferEvent).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.extraSmall,
}))``

const ExpirationBookingContainer = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  color: theme.colors.primary,
}))

const ExpirationBookingLabel = styled(Typo.CaptionPrimary)({
  marginRight: getSpacing(4),
})

const ShareContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  marginRight: theme.contentPage.marginHorizontal,
  borderRadius: theme.buttons.roundedButton.size,
}))
