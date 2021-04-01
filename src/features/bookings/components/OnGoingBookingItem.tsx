import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import {
  formatToCompleteFrenchDateTime,
  formatToCompleteFrenchDate,
  isToday,
  isTomorrow,
  mapCategoryToIcon,
} from 'libs/parsers'
import { Separator } from 'ui/components/Separator'
import { Clock } from 'ui/svg/icons/Clock'
import { DuoBold } from 'ui/svg/icons/DuoBold'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { getBookingProperties, BookingProperties } from '../helpers'

import { BookingItemTitle, getTitleWidth } from './BookingItemTitle'
import { OnGoingTicket, onGoingTicketWidth } from './OnGoingTicket'
import { Booking, BookingItemProps } from './types'

export const OnGoingBookingItem = ({ booking }: BookingItemProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { stock } = booking
  const bookingProperties = getBookingProperties(booking)

  const iconName = stock.offer.category.name || null
  const { dateLabel, withdrawLabel } = getItemViewProperties(booking, bookingProperties)

  return (
    <Container
      onPress={() => navigate('BookingDetails', { id: booking.id })}
      testID={'OnGoingBookingItem'}>
      <ItemContainer>
        <OnGoingTicket image={stock.offer.image?.url} altIcon={mapCategoryToIcon(iconName)} />
        <AttributesView>
          <BookingItemTitle ticketWidth={onGoingTicketWidth} title={stock.offer.name} />
          {Boolean(dateLabel) && <DateLabel color={ColorsEnum.GREY_DARK}>{dateLabel}</DateLabel>}
          <Spacer.Column numberOfSpaces={1} />
          {bookingProperties.isDuo && <DuoBold />}
          <Spacer.Flex />
          {Boolean(withdrawLabel) && (
            <WithDrawContainer>
              <Clock size={20} color={ColorsEnum.PRIMARY} />
              <Spacer.Row numberOfSpaces={1} />
              <WithdrawCaption color={ColorsEnum.PRIMARY} numberOfLines={2}>
                {withdrawLabel}
              </WithdrawCaption>
            </WithDrawContainer>
          )}
        </AttributesView>
      </ItemContainer>
      <Separator />
    </Container>
  )
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({})

const ItemContainer = styled.View({
  flexDirection: 'row',
  paddingVertical: getSpacing(4),
})

const AttributesView = styled.View({
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(1),
})

const WithDrawContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  width: getTitleWidth(onGoingTicketWidth),
})

const DateLabel = styled(Typo.Body)({
  width: getTitleWidth(onGoingTicketWidth),
})

const WithdrawCaption = styled(Typo.Caption)({
  marginRight: getSpacing(4),
})

function getItemViewProperties(booking: Booking, properties: BookingProperties) {
  const { stock } = booking

  const beginningDatetime = stock.beginningDatetime ? new Date(stock.beginningDatetime) : null
  const expirationDatetime = booking.expirationDate ? new Date(booking.expirationDate) : null

  let dateLabel = ''
  let withdrawLabel = ''

  if (properties.isPermanent) {
    dateLabel = 'permanent'
  } else if (properties.isEvent) {
    dateLabel = beginningDatetime
      ? _(t`le\u00a0`) + formatToCompleteFrenchDateTime(beginningDatetime, false)
      : ''

    const isBeginningToday = beginningDatetime ? isToday(beginningDatetime) : false
    const isBeginningTomorrow = beginningDatetime ? isTomorrow(beginningDatetime) : false
    if (isBeginningToday) {
      withdrawLabel = _(t`Aujourd'hui`)
    } else if (isBeginningTomorrow) {
      withdrawLabel = _(t`Demain`)
    }
  } else if (properties.isPhysical) {
    dateLabel = expirationDatetime
      ? _(t`À retirer avant le\u00a0`) + formatToCompleteFrenchDate(expirationDatetime)
      : ''

    const isExpiringToday = expirationDatetime ? isToday(expirationDatetime) : false
    const isExpiringTomorrow = expirationDatetime ? isTomorrow(expirationDatetime) : false
    if (isExpiringToday) {
      withdrawLabel = _(t`Dernier jour pour retirer`)
    } else if (isExpiringTomorrow) {
      withdrawLabel = _(t`Avant dernier jour pour retirer`)
    }
  }

  return { dateLabel, withdrawLabel }
}
