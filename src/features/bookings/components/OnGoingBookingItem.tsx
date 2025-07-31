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
import { Booking } from 'features/bookings/types'
import { getShareOffer } from 'features/share/helpers/getShareOffer'
import { WebShareModal } from 'features/share/pages/WebShareModal'
import { analytics } from 'libs/analytics/provider'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { TileContentType, tileAccessibilityLabel } from 'libs/tileAccessibilityLabel'
import { RoundedButton } from 'ui/components/buttons/RoundedButton'
import { useModal } from 'ui/components/modals/useModal'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Clock as InitialClock } from 'ui/svg/icons/Clock'
import { Duo } from 'ui/svg/icons/Duo'
import { OfferEvent as DefaultOfferEvent } from 'ui/svg/icons/OfferEvent'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  booking: Booking
  eligibleBookingsForArchive?: Booking[]
}

export const OnGoingBookingItem = ({ booking, eligibleBookingsForArchive }: Props) => {
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
    offer: stock.offer,
    utmMedium: 'booking',
  })

  const pressShareOffer = useCallback(() => {
    analytics.logShare({ type: 'Offer', from: 'bookings', offerId: stock.offer.id })
    shareOffer()
    showShareOfferModal()
  }, [stock.offer.id, shareOffer, showShareOfferModal])

  return (
    <React.Fragment>
      <ContentContainer
        navigateTo={{ screen: 'BookingDetails', params: { id: booking.id } }}
        onBeforeNavigate={() => {
          analytics.logViewedBookingPage({
            offerId: stock.offer.id,
            from: 'bookings',
          })
        }}
        accessibilityLabel={accessibilityLabel}>
        <OfferImage imageUrl={stock.offer.image?.url} categoryId={categoryId} size="tall" />
        <AttributesView>
          <BookingItemTitle title={stock.offer.name} />
          {dateLabel ? <DateLabel>{dateLabel}</DateLabel> : null}
          {bookingProperties.isDuo ? <Duo /> : null}
          <Spacer.Flex />
          {withdrawLabel ? (
            <React.Fragment>
              {stock.offer.withdrawalType === WithdrawalTypeEnum.on_site ? (
                <WithdrawContainer testID="on-site-withdrawal-container">
                  <OfferEvent />
                  <OnSiteWithdrawalCaption numberOfLines={2}>
                    {withdrawLabel}
                  </OnSiteWithdrawalCaption>
                </WithdrawContainer>
              ) : (
                <WithdrawContainer testID="withdraw-container">
                  <Clock />
                  <WithdrawCaption numberOfLines={2}>{withdrawLabel}</WithdrawCaption>
                </WithdrawContainer>
              )}
            </React.Fragment>
          ) : null}
          {canDisplayExpirationMessage ? (
            <ExpirationBookingContainer testID="expiration-booking-container">
              <Clock />
              <ExpirationBookingLabel>{correctExpirationMessages}</ExpirationBookingLabel>
            </ExpirationBookingContainer>
          ) : null}
        </AttributesView>
      </ContentContainer>
      <ShareContainer>
        <RoundedButton
          iconName="share"
          onPress={pressShareOffer}
          accessibilityLabel={`Partager l’offre ${stock.offer.name}`}
        />
      </ShareContainer>
      {shareContent ? (
        <WebShareModal
          visible={shareOfferModalVisible}
          headerTitle="Partager l’offre"
          shareContent={shareContent}
          dismissModal={hideShareOfferModal}
        />
      ) : null}
    </React.Fragment>
  )
}

const ContentContainer = styled(InternalTouchableLink)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  flexDirection: 'row',
  paddingRight: theme.buttons.roundedButton.size,
}))

const AttributesView = styled.View(({ theme }) => ({
  flex: 1,
  paddingLeft: theme.designSystem.size.spacing.l,
  paddingRight: theme.designSystem.size.spacing.xs,
}))

const WithdrawContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const DateLabel = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const WithdrawCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
  marginRight: theme.designSystem.size.spacing.l,
  color: theme.designSystem.color.text.brandPrimary,
}))

const OnSiteWithdrawalCaption = styled(WithdrawCaption)(({ theme }) => ({
  color: theme.designSystem.color.text.brandPrimary,
  marginTop: theme.designSystem.size.spacing.xs,
}))

const Clock = styled(InitialClock).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.extraSmall,
}))``

const OfferEvent = styled(DefaultOfferEvent).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.extraSmall,
}))``

const ExpirationBookingContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const ExpirationBookingLabel = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandPrimary,
  marginTop: theme.designSystem.size.spacing.xs,
  marginRight: theme.designSystem.size.spacing.l,
}))

const ShareContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  marginRight: theme.contentPage.marginHorizontal,
  borderRadius: theme.buttons.roundedButton.size,
}))
