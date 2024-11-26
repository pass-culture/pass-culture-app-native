import React from 'react'
import styled from 'styled-components/native'

import { DuoChoice } from 'features/bookOffer/components/DuoChoice'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { parseCurrencyFromCents } from 'libs/parsers/parseCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { BicolorProfile as ProfileIcon } from 'ui/svg/icons/BicolorProfile'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

export const DuoChoiceSelector: React.FC = () => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo } = useBookingOffer() ?? {}
  const stock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const getChoiceInfosForQuantity = (quantity: 1 | 2) => {
    const enoughCredit = stock ? quantity * stock.price <= offerCredit : false
    return {
      price:
        enoughCredit && stock
          ? parseCurrencyFromCents(
              quantity * stock.price,
              currency,
              euroToPacificFrancRate
            ).replace(/\u00A0/g, '')
          : 'crédit insuffisant',
      title: quantity === 1 ? 'Solo' : 'Duo',
      selected: bookingState.quantity === quantity,
      icon: quantity === 1 ? SoloPerson : DuoPerson,
      onPress: () => dispatch({ type: 'SELECT_QUANTITY', payload: quantity }),
      hasEnoughCredit: enoughCredit,
    }
  }

  return (
    <DuoChoiceContainer testID="DuoChoiceSelector">
      <DuoChoice {...getChoiceInfosForQuantity(1)} testID="DuoChoice1" />
      {isDuo ? <DuoChoice {...getChoiceInfosForQuantity(2)} testID="DuoChoice2" /> : null}
    </DuoChoiceContainer>
  )
}

const SoloPerson = (props: AccessibleIcon) => <ProfileIcon {...props} />

const DuoPerson = (props: AccessibleIcon): React.JSX.Element => (
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
