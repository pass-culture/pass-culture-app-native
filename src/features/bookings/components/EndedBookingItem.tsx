import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'

import { BookingCancellationReasons } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { _ } from 'libs/i18n'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Check } from 'ui/svg/icons/Check'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { BookingItemTitle, getTitleWidth } from './BookingItemTitle'
import { EndedBookingTicket, endedBookingTicketWidth } from './EndedBookingTicket'
import { BookingItemProps } from './types'

export const EndedBookingItem = ({ booking }: BookingItemProps) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking

  const endedBookingReason = getEndedBookingReason(cancellationReason, dateUsed)
  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  return (
    <TouchableOpacity
      onPress={() =>
        navigate('Offer', {
          id: stock.offer.id,
          shouldDisplayLoginModal: false,
          from: 'endedbookings',
        })
      }
      testID="EndedBookingItem">
      <ItemContainer>
        <EndedBookingTicket
          image={stock.offer.image?.url}
          offerCategory={stock.offer.category.name}
        />
        <Spacer.Row numberOfSpaces={4} />
        <View>
          <BookingItemTitle ticketWidth={endedBookingTicketWidth} title={stock.offer.name} />
          <EndedReasonAndDate>
            {endedBookingReason}
            <Spacer.Row numberOfSpaces={1} />
            <DateLabel>{endedBookingDateLabel}</DateLabel>
          </EndedReasonAndDate>
        </View>
      </ItemContainer>
    </TouchableOpacity>
  )
}

const ItemContainer = styled.View({
  flexDirection: 'row',
})

const EndedReasonAndDate = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  width: getTitleWidth(endedBookingTicketWidth),
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
      <InputRule title={_(t`Utilisé`)} icon={Check} color={ColorsEnum.GREEN_VALID} iconSize={20} />
    )

  if (cancellationReason === BookingCancellationReasons.OFFERER)
    return <InputRule title={_(t`Annulé`)} icon={Check} color={ColorsEnum.ERROR} iconSize={20} />

  return (
    <InputRule
      title={_(t`Réservation annulée`)}
      icon={Check}
      color={ColorsEnum.ERROR}
      iconSize={20}
    />
  )
}

function getEndedBookingDateLabel(cancellationDate?: Date | null, dateUsed?: Date | null) {
  const label = _(t`le\u00a0`)
  if (dateUsed) return label + formatToSlashedFrenchDate(new Date(dateUsed).toISOString())
  if (cancellationDate)
    return label + formatToSlashedFrenchDate(new Date(cancellationDate).toISOString())
  return null
}
