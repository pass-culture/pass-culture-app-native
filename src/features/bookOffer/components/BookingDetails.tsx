import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { OfferStockResponse } from 'api/gen'
import { BookingInformations } from 'features/bookOffer/components/BookingInformations'
import { CancellationDetails } from 'features/bookOffer/components/CancellationDetails'
import { DuoChoiceSelector } from 'features/bookOffer/components/DuoChoiceSelector'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { RotatingTextOptions, useRotatingText } from 'features/bookOffer/helpers/useRotatingText'
import { useIsUserUnderage } from 'features/profile/helpers/useIsUserUnderage'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InfoBanner } from 'ui/components/InfoBanner'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface BookingDetailsProps {
  stocks: OfferStockResponse[]
  onPressBookOffer: VoidFunction
  isLoading?: boolean
}

const LOADING_MESSAGES: RotatingTextOptions[] = [
  {
    message: 'En cours de confirmation...',
    keepDuration: 5000,
  },
  {
    message: 'Patiente quelques instants...',
    keepDuration: 5000,
  },
  {
    message: 'On y est presque...',
  },
]

export const BookingDetails: React.FC<BookingDetailsProps> = ({
  stocks,
  onPressBookOffer,
  isLoading,
}) => {
  const theme = useTheme()

  const { bookingState, dispatch } = useBookingContext()
  const selectedStock = useBookingStock()
  const offer = useBookingOffer()

  const isUserUnderage = useIsUserUnderage()
  const mapping = useSubcategoriesMapping()
  const { quantity } = bookingState
  const accessibilityDescribedBy = uuidv4()

  const isEvent = offer?.subcategoryId ? mapping[offer?.subcategoryId]?.isEvent : undefined

  const loadingMessage = useRotatingText(LOADING_MESSAGES, isLoading)

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

  const deductedAmount = `${formattedPriceWithEuro} seront déduits de ton crédit pass Culture`

  const isStockBookable = !(isUserUnderage && selectedStock.isForbiddenToUnderage)

  return isLoading ? (
    <Center testID="loadingScreen">
      <Spacer.Column numberOfSpaces={50} />
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.ButtonText>{loadingMessage}</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={50} />
    </Center>
  ) : (
    <Container>
      <InfoBanner
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

const Center = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
}))

const Caption = styled(Typo.CaptionNeutralInfo)({
  marginTop: getSpacing(1),
  textAlign: 'center',
})
