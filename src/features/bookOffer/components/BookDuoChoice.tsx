import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { useCreditForOffer } from 'features/offer/services/useHasEnoughCredit'
import { formatToFrenchDecimal } from 'libs/parsers'
import { DuoPerson } from 'ui/svg/icons/DuoPerson'
import { ProfileDeprecated } from 'ui/svg/icons/Profile_deprecated'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

import { DuoChoice } from '../atoms/DuoChoice'
import { useBooking, useBookingOffer, useBookingStock } from '../pages/BookingOfferWrapper'
import { Step } from '../pages/reducer'

export const BookDuoChoice: React.FC = () => {
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
      icon: quantity === 1 ? ProfileDeprecated : DuoPerson,
      onPress: () => dispatch({ type: 'SELECT_QUANTITY', payload: quantity }),
      hasEnoughCredit: enoughCredit,
    }
  }

  const changeQuantity = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.DUO })
  }

  return (
    <React.Fragment>
      <Typo.Title4 testID="DuoStep">{t`Nombre de place`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      {bookingState.step === Step.DUO ? (
        <DuoChoiceContainer>
          <DuoChoice {...getChoiceInfosForQuantity(1)} testID={`DuoChoice1`} />
          {!!isDuo && <DuoChoice {...getChoiceInfosForQuantity(2)} testID={`DuoChoice2`} />}
        </DuoChoiceContainer>
      ) : (
        <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={changeQuantity}>
          <Typo.ButtonText>
            {bookingState.quantity && bookingState.quantity === 1 ? t`Solo` : t`Duo`}
          </Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}

const DuoChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})
