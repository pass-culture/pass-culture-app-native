import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { DuoChoice } from 'features/bookOffer/atoms/DuoChoice'
import {
  useBooking,
  useBookingOffer,
  useBookingStock,
} from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { useCreditForOffer } from 'features/offer/services/useHasEnoughCredit'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Profile } from 'ui/svg/icons/Profile'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
      icon: quantity === 1 ? Profile : DuoPerson,
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
        <TouchableOpacity onPress={changeQuantity}>
          <Typo.ButtonText>
            {bookingState.quantity && bookingState.quantity === 1 ? t`Solo` : t`Duo`}
          </Typo.ButtonText>
        </TouchableOpacity>
      )}
    </React.Fragment>
  )
}

const DuoPerson = (props: IconInterface): JSX.Element => (
  <DuoPersonContainer>
    <Profile {...props} />
    <Profile {...props} />
  </DuoPersonContainer>
)

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))``

const DuoChoiceContainer = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -getSpacing(2),
})

const DuoPersonContainer = styled.View({ flexDirection: 'row' })
