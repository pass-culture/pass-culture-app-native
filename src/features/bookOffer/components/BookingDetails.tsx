import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { isApiError } from 'api/apiHelpers'
import { OfferStockResponse } from 'api/gen'
import { useBookOfferMutation } from 'features/bookOffer/api/useBookOfferMutation'
import { BookingInformations } from 'features/bookOffer/components/BookingInformations'
import { CancellationDetails } from 'features/bookOffer/components/CancellationDetails'
import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { useLogOfferConversion } from 'libs/algolia/analytics/logOfferConversion'
import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Banner } from 'ui/components/Banner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  stocks: OfferStockResponse[]
}

const errorCodeToMessage: Record<string, string> = {
  INSUFFICIENT_CREDIT:
    'Attention, ton crédit est insuffisant pour pouvoir réserver cette offre\u00a0!',
  ALREADY_BOOKED: 'Attention, il est impossible de réserver plusieurs fois la même offre\u00a0!',
  STOCK_NOT_BOOKABLE: 'Oups, cette offre n’est plus disponible\u00a0!',
}

export const BookingDetails: React.FC<Props> = ({ stocks }) => {
  const theme = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()
  const { bookingState, dismissModal, dispatch } = useBookingContext()
  const selectedStock = useBookingStock()
  const offer = useBookingOffer()
  const { showErrorSnackBar } = useSnackBarContext()
  const isUserUnderage = useIsUserUnderage()
  const mapping = useSubcategoriesMapping()
  const { quantity, offerId } = bookingState
  const accessibilityDescribedBy = uuidv4()
  const route = useRoute<UseRouteType<'Offer'>>()
  const { logOfferConversion } = useLogOfferConversion()

  const isFromSearch = route.params?.from === 'search'
  const fromOfferId = route.params?.fromOfferId
  const algoliaOfferId = offerId?.toString()

  const isEvent = offer?.subcategoryId ? mapping[offer?.subcategoryId]?.isEvent : undefined

  const { mutate, isLoading } = useBookOfferMutation({
    onSuccess: ({ bookingId }) => {
      dismissModal()
      if (offerId) {
        analytics.logBookingConfirmation(offerId, bookingId, fromOfferId)
        isFromSearch && algoliaOfferId && logOfferConversion(algoliaOfferId)

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
      let message = 'En raison d’une erreur technique, l’offre n’a pas pu être réservée'

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
    // So we select it programmatically given the bookable stocks.
    const firstBookableStock = stocks.find(({ isBookable }) => isBookable)

    if (!selectedStock && firstBookableStock) {
      dispatch({ type: 'SELECT_STOCK', payload: firstBookableStock.id })
      dispatch({ type: 'SELECT_QUANTITY', payload: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks, selectedStock])

  // Change step to confirmation if no event offer
  useEffect(() => {
    if (!isEvent && bookingState.step === Step.DATE) {
      dispatch({ type: 'CHANGE_STEP', payload: Step.CONFIRMATION })
    }
  }, [bookingState.step, dispatch, isEvent])

  if (!selectedStock || typeof quantity !== 'number') return <React.Fragment />

  const priceInCents = quantity * selectedStock.price
  const formattedPriceWithEuro = formatToFrenchDecimal(priceInCents)

  const onPressBookOffer = () => mutate({ quantity, stockId: selectedStock.id })

  const deductedAmount = `${formattedPriceWithEuro} seront déduits de ton crédit pass Culture`

  const isStockBookable = !(isUserUnderage && selectedStock.isForbiddenToUnderage)

  return isLoading ? (
    <Container>
      <Spacer.Column numberOfSpaces={8} />
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Spacer.Column numberOfSpaces={8} />
    </Container>
  ) : (
    <Container>
      <Banner
        message="Les réservations effectuées sur le pass Culture sont destinées à un usage strictement personnel et ne peuvent faire l’objet de revente."
        icon={Error}
      />
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

      <ButtonContainer>
        <ButtonPrimary
          disabled={!isStockBookable}
          wording="Confirmer la réservation"
          onPress={onPressBookOffer}
          accessibilityDescribedBy={accessibilityDescribedBy}
        />
      </ButtonContainer>
      {!!formattedPriceWithEuro && (
        <Caption nativeID={accessibilityDescribedBy}>{deductedAmount}</Caption>
      )}
    </Container>
  )
}

const ButtonContainer = styled.View({
  alignItems: 'center',
})

const Container = styled.View({ width: '100%' })

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))

const Caption = styled(Typo.CaptionNeutralInfo)({
  marginTop: getSpacing(1),
  textAlign: 'center',
})
