import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBooking, useBookingStock } from '../pages/BookingOfferWrapper'
import { useBookOfferMutation } from '../services/useBookOfferMutation'

import { BookingInformations } from './BookingInformations'
import { CancellationDetails } from './CancellationDetails'

const disclaimer = _(
  t`Les biens acquis ou réservés sur le pass Culture sont destinés à un usage strictement personnel et ne peuvent faire l’objet de revente.`
)

export const BookingDetails: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { bookingState, dismissModal } = useBooking()
  const stock = useBookingStock()
  const { showErrorSnackBar } = useSnackBarContext()

  const { mutate } = useBookOfferMutation({
    onSuccess: () => {
      dismissModal()
      navigate('BookingConfirmation')
    },
    onError: () => {
      showErrorSnackBar({
        message: _(t`Erreur. L'offre n'a pas été réservée !`),
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  if (!stock) return <React.Fragment />

  const price =
    stock.price > 0 ? formatToFrenchDecimal(bookingState.quantity * stock.price) : undefined

  const onPressBookOffer = () =>
    mutate({ quantity: bookingState.quantity, stockId: stock.id.toString() })

  return (
    <Container>
      <Banner title={disclaimer} />
      <Spacer.Column numberOfSpaces={4} />

      <BookingInformations />

      <Spacer.Column numberOfSpaces={4} />
      <Separator />
      <Spacer.Column numberOfSpaces={4} />

      <CancellationDetails />

      <Spacer.Column numberOfSpaces={6} />

      <ButtonPrimary title={_(t`Confirmer la réservation`)} onPress={onPressBookOffer} />
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
  marginTop: getSpacing(1),
  marginBottom: -getSpacing(1),
  textAlign: 'center',
})
