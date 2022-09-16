import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DuoChoice } from 'features/bookOffer/atoms/DuoChoice'
import {
  useBooking,
  useBookingOffer,
  useBookingStock,
} from 'features/bookOffer/pages/BookingOfferWrapper'
import { useCreditForOffer } from 'features/offer/services/useHasEnoughCredit'
import { formatToFrenchDecimal } from 'libs/parsers'
import { BicolorProfile as ProfileIcon } from 'ui/svg/icons/BicolorProfile'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

export const DuoChoiceSelector: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const { isDuo } = useBookingOffer() || {}
  const stock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)

  const getChoiceInfosForQuantity = (quantity: 1 | 2) => {
    const enoughCredit = stock ? quantity * stock.price <= offerCredit : false
    return {
      price:
        enoughCredit && stock
          ? formatToFrenchDecimal(quantity * stock.price).replace(' ', '')
          : t`crédit insuffisant`,
      title: quantity === 1 ? t`Solo` : t`Duo`,
      selected: bookingState.quantity === quantity,
      icon: quantity === 1 ? ProfileIcon : DuoPerson,
      onPress: () => dispatch({ type: 'SELECT_QUANTITY', payload: quantity }),
      hasEnoughCredit: enoughCredit,
    }
  }

  return (
    <DuoChoiceContainer testID="DuoChoiceSelector">
      <DuoChoice {...getChoiceInfosForQuantity(1)} testID={`DuoChoice1`} />
      {!!isDuo && <DuoChoice {...getChoiceInfosForQuantity(2)} testID={`DuoChoice2`} />}
    </DuoChoiceContainer>
  )
}

const DuoPerson = (props: IconInterface): JSX.Element => (
  <DuoPersonContainer>
    <ProfileIcon {...props} />
    <ProfileIcon {...props} />
  </DuoPersonContainer>
)

const DuoChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})

const DuoPersonContainer = styled.View({ flexDirection: 'row' })
