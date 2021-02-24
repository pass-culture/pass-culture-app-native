import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { useBooking, useBookingStock } from '../pages/BookingOfferWrapper'

import { BookingInformations } from './BookingInformations'
import { CancellationDetails } from './CancellationDetails'

const disclaimer = _(
  t`Les biens acquis ou réservés sur le pass Culture sont destinés à un usage strictement personnel et ne peuvent faire l’objet de revente.`
)

interface Props {
  dismissModal: () => void
}

export const BookingDetails: React.FC<Props> = ({ dismissModal }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { bookingState } = useBooking()
  const stock = useBookingStock()

  if (!stock) return <React.Fragment />

  const price =
    stock.price > 0 ? formatToFrenchDecimal(bookingState.quantity * stock.price) : undefined

  return (
    <Container>
      <Banner title={disclaimer} />
      <Spacer.Column numberOfSpaces={6} />

      <BookingInformations />

      <Spacer.Column numberOfSpaces={6} />
      <Separator />
      <Spacer.Column numberOfSpaces={6} />

      <CancellationDetails />

      <Spacer.Column numberOfSpaces={6} />

      <ButtonPrimary
        title={_(t`Confirmer la réservation`)}
        onPress={() => {
          dismissModal()
          navigate('BookingConfirmation')
        }}
      />
      <Spacer.Column numberOfSpaces={2} />
      {price ? (
        <Caption>{_(t`${price} seront déduits de ton crédit pass Culture`)}</Caption>
      ) : (
        <Spacer.Column numberOfSpaces={4} />
      )}
    </Container>
  )
}

const Container = styled.View({ width: '100%' })
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
})
const Caption = styled(Typo.Caption).attrs({ color: ColorsEnum.GREY_DARK })({
  textAlign: 'center',
})
