import React from 'react'
import styled from 'styled-components/native'

import { WithdrawalTypeEnum } from 'api/gen'
import { getBookingLabels, getBookingProperties } from 'features/bookings/helpers'
import { BookingItemProps } from 'features/bookings/types'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorClock as DefaultClock } from 'ui/svg/icons/BicolorClock'
import { Duo } from 'ui/svg/icons/Duo'
import { OfferEvent as DefaultOfferEvent } from 'ui/svg/icons/OfferEvent'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { BookingItemTitle } from './BookingItemTitle'

export const OnGoingBookingItem = ({ booking }: BookingItemProps) => {
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

  return (
    <Container
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
                <OnSiteWithdrawalCaption numberOfLines={2}>{withdrawLabel}</OnSiteWithdrawalCaption>
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
      </AttributesView>
    </Container>
  )
}

const Container = styled(InternalTouchableLink)({
  paddingHorizontal: getSpacing(6),
  flexDirection: 'row',
})

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
