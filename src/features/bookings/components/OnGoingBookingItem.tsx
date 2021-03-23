import { t } from '@lingui/macro'
import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'

import { CategoryType } from 'api/gen'
import { _ } from 'libs/i18n'
import { formatToCompleteFrenchDateTime, isToday, isTomorrow } from 'libs/parsers'
import { Separator } from 'ui/components/Separator'
import { Clock } from 'ui/svg/icons/Clock'
import { DuoBold } from 'ui/svg/icons/DuoBold'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { OnGoingTicket, onGoingTicketWidth } from './OnGoingTicket'
import { Booking } from './types'

interface OnGoingBookingItemProps {
  booking: Booking
}

export const OnGoingBookingItem = ({ booking }: OnGoingBookingItemProps) => {
  const { stock } = booking
  stock.offer.category.categoryType
  const beginningDatetime = stock.beginningDatetime ? new Date(stock.beginningDatetime) : null

  const { isDuo, dateLabel, withdrawLabel } = getItemViewProperties(booking, beginningDatetime)

  return (
    <React.Fragment>
      <ItemContainer>
        <OnGoingTicket image={stock.offer.image?.url} />
        <AttributesView>
          <TitleContainer>
            <Title numberOfLines={2}>{stock.offer.name}</Title>
          </TitleContainer>
          {Boolean(dateLabel) && <Typo.Body color={ColorsEnum.GREY_DARK}>{dateLabel}</Typo.Body>}
          {isDuo && <DuoBold />}
          <Spacer.Flex />
          {Boolean(withdrawLabel) && (
            <WithDrawContainer>
              <Clock size={20} color={ColorsEnum.PRIMARY} />
              <Spacer.Row numberOfSpaces={1} />
              <Typo.Caption color={ColorsEnum.PRIMARY}>{withdrawLabel}</Typo.Caption>
            </WithDrawContainer>
          )}
        </AttributesView>
      </ItemContainer>
      <Separator />
    </React.Fragment>
  )
}
const viewWidth = Dimensions.get('screen').width - onGoingTicketWidth - 40

const ItemContainer = styled.View({
  flexDirection: 'row',
  paddingVertical: getSpacing(4),
})

const AttributesView = styled.View({
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(1),
})

const TitleContainer = styled.View({
  flexDirection: 'row',
  width: viewWidth,
  paddingBottom: getSpacing(1),
})

const Title = styled(Typo.ButtonText)({
  flexShrink: 1,
})

const WithDrawContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

function isDuoBooking(booking: Booking) {
  return booking.quantity === 2
}

function getItemViewProperties(booking: Booking, beginningDatetime?: Date | null) {
  const { offer } = booking.stock

  const isEvent = Boolean(beginningDatetime)
  const isPhysical = offer.category.categoryType === CategoryType.Thing

  const isBeginningToday = beginningDatetime ? isToday(beginningDatetime) : false
  const isBeginningTomorrow = beginningDatetime ? isTomorrow(beginningDatetime) : false

  let isDuo = false
  let dateLabel = ''
  let withdrawLabel = ''

  if (offer.isPermanent) {
    dateLabel = 'permanent'
  } else if (isEvent) {
    isDuo = isDuoBooking(booking)
    dateLabel = beginningDatetime
      ? _(t`le\u00a0`) + formatToCompleteFrenchDateTime(beginningDatetime)
      : ''
    if (isBeginningToday) {
      withdrawLabel = _(t`Aujourd'hui`)
    } else if (isBeginningTomorrow) {
      withdrawLabel = _(t`Demain`)
    }
  } else if (isPhysical) {
    dateLabel = beginningDatetime
      ? _(t`À retirer avant\u00a0`) + formatToCompleteFrenchDateTime(beginningDatetime)
      : ''
    if (isBeginningToday) {
      withdrawLabel = _(t`Dernier jour pour retirer`)
    } else if (isBeginningTomorrow) {
      withdrawLabel = _(t`Avant dernier jour pour retirer`)
    }
  }

  return { isDuo, dateLabel, withdrawLabel }
}
