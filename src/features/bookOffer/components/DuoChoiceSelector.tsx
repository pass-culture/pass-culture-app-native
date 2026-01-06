import React from 'react'
import styled from 'styled-components/native'

import { DuoChoice } from 'features/bookOffer/components/DuoChoice'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Profile as ProfileIcon } from 'ui/svg/icons/Profile'
import { AccessibleIcon } from 'ui/svg/icons/types'

export const DuoChoiceSelector: React.FC = () => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo } = useBookingOfferQuery() ?? {}
  const stock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

  const getChoiceInfosForQuantity = (quantity: 1 | 2) => {
    const enoughCredit = stock ? quantity * stock.price <= offerCredit : false
    return {
      price:
        enoughCredit && stock
          ? formatCurrencyFromCents(quantity * stock.price, currency, euroToPacificFrancRate)
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

const DuoChoiceContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: -theme.designSystem.size.spacing.s,
}))

const DuoPersonContainer = styled.View({ flexDirection: 'row' })
