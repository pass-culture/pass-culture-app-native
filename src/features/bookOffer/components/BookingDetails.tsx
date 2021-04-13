import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { OfferStockResponse } from 'api/gen'
import { isApiError } from 'api/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBooking, useBookingStock } from '../pages/BookingOfferWrapper'
import { useBookOfferMutation } from '../services/useBookOfferMutation'

import { BookingInformations } from './BookingInformations'
import { CancellationDetails } from './CancellationDetails'

const disclaimer = t`Les biens acquis ou réservés sur le pass Culture sont destinés à un usage strictement personnel et ne peuvent faire l’objet de revente.`

interface Props {
  stocks: OfferStockResponse[]
}

const errorCodeToMessage: Record<string, string> = {
  INSUFFICIENT_CREDIT: t`Attention, ton crédit est insuffisant pour pouvoir réserver cette offre !`,
  ALREADY_BOOKED: t`Attention, il est impossible de réserver plusieurs fois la même offre !`,
  STOCK_NOT_BOOKABLE: t`Oups, cette offre n’est plus disponible !`,
}

export const BookingDetails: React.FC<Props> = ({ stocks }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { bookingState, dismissModal, dispatch } = useBooking()
  const stock = useBookingStock()
  const { showErrorSnackBar } = useSnackBarContext()
  const { quantity, offerId } = bookingState

  const { mutate } = useBookOfferMutation({
    onSuccess: ({ bookingId }) => {
      dismissModal()
      if (offerId) {
        navigate('BookingConfirmation', { offerId, bookingId })
      }
    },
    onError: (error) => {
      let message = t`En raison d’une erreur technique, l’offre n’a pas pu être réservée`

      if (isApiError(error)) {
        const { content } = error as { content: { code: string } }
        if (content && content.code && content.code in errorCodeToMessage) {
          message = errorCodeToMessage[content.code]
          if (typeof offerId === 'number') {
            analytics.logBookingError(offerId, content.code)
          }
        }
      }

      showErrorSnackBar({ message, timeout: SNACK_BAR_TIME_OUT })
    },
  })

  useEffect(() => {
    const { id } = stocks[0] || {}

    if (!stock && typeof id === 'number') {
      dispatch({ type: 'SELECT_STOCK', payload: id })
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }, [])

  if (!stock || typeof quantity !== 'number') return <React.Fragment />

  const price = stock.price > 0 ? formatToFrenchDecimal(quantity * stock.price) : undefined

  const onPressBookOffer = () => mutate({ quantity, stockId: stock.id })

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

      <ButtonPrimary title={t`Confirmer la réservation`} onPress={onPressBookOffer} />
      {price ? (
        <Caption>{t`${price} seront déduits de ton crédit pass Culture`}</Caption>
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
