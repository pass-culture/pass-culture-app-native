import React from 'react'
import styled from 'styled-components/native'

import { DuoChoice } from 'features/bookOffer/components/DuoChoice'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { BicolorProfile as ProfileIcon } from 'ui/svg/icons/BicolorProfile'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { Error } from 'ui/svg/icons/Error'
import { TextInput } from 'ui/components/inputs/TextInput'

export const DuoChoiceSelector: React.FC = () => {
  const { bookingState, dispatch } = useBookingContext()
  const { isDuo } = useBookingOffer() ?? {}
  const stock = useBookingStock()
  const offerCredit = useCreditForOffer(bookingState.offerId)

  const getChoiceInfosForQuantity = (quantity: 1 | 2) => {
    const enoughCredit = stock ? quantity * stock.price <= offerCredit : false
    return {
      price:
        enoughCredit && stock
          ? formatToFrenchDecimal(quantity * stock.price).replace(' ', '')
          : 'crédit insuffisant',
      title: quantity === 1 ? 'Solo' : 'Duo',
      selected: bookingState.quantity === quantity,
      icon: quantity === 1 ? SoloPerson : DuoPerson,
      onPress: () => dispatch({ type: 'SELECT_QUANTITY', payload: quantity }),
      hasEnoughCredit: enoughCredit,
    }
  }

  return (
    <React.Fragment>
      <DuoChoiceContainer testID="DuoChoiceSelector">
        <DuoChoice {...getChoiceInfosForQuantity(1)} testID="DuoChoice1" />
        {isDuo ? <DuoChoice {...getChoiceInfosForQuantity(2)} testID="DuoChoice2" /> : null}
      </DuoChoiceContainer>

      {bookingState.quantity === 2 ?
        <React.Fragment>
          <Spacer.Column numberOfSpaces={6} />
          <InfoBanner message="Invite un proche pour t'accompagner à cet évènement !" icon={Error}></InfoBanner>
          <Spacer.Column numberOfSpaces={6} />
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Adresse e-mail de ton accompagnant.e"
            onChangeText={() => undefined}
            placeholder="tabelletante@email.com"
            textContentType="emailAddress"
            maxLength={120}
          />
        </React.Fragment> : null}
    </React.Fragment>
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
