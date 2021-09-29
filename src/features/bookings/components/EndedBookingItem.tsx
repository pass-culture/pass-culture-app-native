import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { BookingCancellationReasons } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useCategoryId } from 'libs/subcategories'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Check } from 'ui/svg/icons/Check'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { BookingItemTitle } from './BookingItemTitle'
import { EndedBookingTicket } from './EndedBookingTicket'
import { BookingItemProps } from './types'

export const EndedBookingItem = ({ booking }: BookingItemProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking
  const categoryId = useCategoryId(stock.offer.subcategoryId)

  const endedBookingReason = getEndedBookingReason(cancellationReason, dateUsed)
  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  return (
    <TouchableOpacity
      onPress={() =>
        navigate('Offer', {
          id: stock.offer.id,
          from: 'endedbookings',
        })
      }
      testID="EndedBookingItem">
      <ItemContainer>
        <EndedBookingTicket image={stock.offer.image?.url} categoryId={categoryId} />
        <Spacer.Row numberOfSpaces={4} />
        <AttributesView>
          <BookingItemTitle title={stock.offer.name} />
          <EndedReasonAndDate>
            {endedBookingReason}
            <Spacer.Row numberOfSpaces={1} />
            <DateLabel>{endedBookingDateLabel}</DateLabel>
          </EndedReasonAndDate>
        </AttributesView>
      </ItemContainer>
    </TouchableOpacity>
  )
}

const AttributesView = styled.View({
  flex: 1,
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(1),
})

const ItemContainer = styled.View({
  flexDirection: 'row',
})

const EndedReasonAndDate = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  flex: 1,
  alignItems: 'center',
})

const DateLabel = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
})

function getEndedBookingReason(
  cancellationReason?: BookingCancellationReasons | null,
  dateUsed?: Date | null
) {
  if (dateUsed)
    return (
      <InputRule title={t`Utilisé`} icon={Check} color={ColorsEnum.GREEN_VALID} iconSize={20} />
    )

  if (cancellationReason === BookingCancellationReasons.OFFERER)
    return <InputRule title={t`Annulé`} icon={Check} color={ColorsEnum.ERROR} iconSize={20} />

  return (
    <InputRule title={t`Réservation annulée`} icon={Check} color={ColorsEnum.ERROR} iconSize={20} />
  )
}

function getEndedBookingDateLabel(cancellationDate?: Date | null, dateUsed?: Date | null) {
  const endDate = dateUsed ?? cancellationDate
  if (endDate) {
    return t({
      id: 'jour de fin de résa',
      values: { date: formatToSlashedFrenchDate(new Date(endDate).toISOString()) },
      message: 'le {date}',
    })
  }
  return null
}
