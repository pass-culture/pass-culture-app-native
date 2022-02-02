import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { isApiError } from 'api/apiHelpers'
import { OfferStockResponse } from 'api/gen'
import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useIsUserUnderage } from 'features/profile/utils'
import { analytics } from 'libs/analytics'
import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { useBooking, useBookingOffer, useBookingStock } from '../pages/BookingOfferWrapper'
import { useBookOfferMutation } from '../services/useBookOfferMutation'

import { BookingInformations } from './BookingInformations'
import { CancellationDetails } from './CancellationDetails'

const disclaimer = t`Les réservations effectuées sur le pass Culture sont destinées à un usage strictement personnel et ne peuvent faire l’objet de revente.`

interface Props {
  stocks: OfferStockResponse[]
}

const errorCodeToMessage: Record<string, string> = {
  INSUFFICIENT_CREDIT: t`Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!`,
  ALREADY_BOOKED: t`Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!`,
  STOCK_NOT_BOOKABLE: t`Oups, cette offre n’est plus disponible\u00a0!`,
}

export const BookingDetails: React.FC<Props> = ({ stocks }) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { bookingState, dismissModal, dispatch } = useBooking()
  const selectedStock = useBookingStock()
  const offer = useBookingOffer()
  const { showErrorSnackBar } = useSnackBarContext()
  const isUserUnderage = useIsUserUnderage()
  const mapping = useSubcategoriesMapping()
  const { quantity, offerId } = bookingState
  const accessibilityDescribedBy = uuidv4()

  const { mutate } = useBookOfferMutation({
    onSuccess: ({ bookingId }) => {
      dismissModal()
      if (offerId) {
        analytics.logBookingConfirmation(offerId, bookingId)
        if (!!selectedStock && !!offer)
          campaignTracker.logEvent(CampaignEvents.COMPLETE_BOOK_OFFER, {
            af_offer_id: offer.id,
            af_booking_id: selectedStock.id,
            af_price: selectedStock.price,
            af_category: offer.subcategoryId,
          })
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
    // For offers of type Thing, we don't manually select a date (thus a stock).
    // So we select it programatically given the bookable stocks.
    const firstBookableStock = stocks.find(({ isBookable }) => isBookable)

    if (!selectedStock && firstBookableStock) {
      dispatch({ type: 'SELECT_STOCK', payload: firstBookableStock.id })
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
  }, [stocks, selectedStock])

  if (!selectedStock || typeof quantity !== 'number') return <React.Fragment />

  const priceInCents = quantity * selectedStock.price
  const formattedPriceWithEuro = formatToFrenchDecimal(priceInCents)

  const onPressBookOffer = () => mutate({ quantity, stockId: selectedStock.id })

  const deductedAmount = t({
    id: 'montant déduit',
    values: { price: formattedPriceWithEuro },
    message: '{price} seront déduits de ton crédit pass Culture',
  })

  const isStockBookable = !(isUserUnderage && selectedStock.isForbiddenToUnderage)

  const isEvent = offer?.subcategoryId ? mapping[offer?.subcategoryId].isEvent : undefined

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

      {!!(offer?.isDuo && !isEvent) && (
        <React.Fragment>
          <Separator />
          <Spacer.Column numberOfSpaces={6} />

          <DuoChoiceSelector />

          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}

      <ButtonPrimary
        disabled={!isStockBookable}
        wording={t`Confirmer la réservation`}
        onPress={onPressBookOffer}
        accessibilityDescribedBy={accessibilityDescribedBy}
      />
      {!!formattedPriceWithEuro && (
        <Caption nativeID={accessibilityDescribedBy}>{deductedAmount}</Caption>
      )}
    </Container>
  )
}

const Container = styled.View({ width: '100%' })

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  marginTop: getSpacing(1),
  textAlign: 'center',
}))
