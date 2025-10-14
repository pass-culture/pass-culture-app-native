import React from 'react'
import { Platform } from 'react-native'

import { CategoryIdEnum, OfferResponseV2, OfferStockResponse } from 'api/gen'
import { AlreadyBooked } from 'features/bookOffer/components/AlreadyBooked'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { BookingImpossible } from 'features/bookOffer/components/BookingImpossible'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getPreviousStep } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useBookingOfferQuery } from 'queries/offer/useBookingOfferQuery'
import { Loader } from 'ui/components/Loader'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

type ModalContent = {
  children: React.JSX.Element
  title: string
} & ModalLeftIconProps

const getDefaultModalContent = (): ModalContent => {
  return {
    children: <Loader message="Chargement en cours..." />,
    title: '',
    leftIconAccessibilityLabel: undefined,
    leftIcon: undefined,
    onLeftIconPress: undefined,
  }
}

const getEndedUseBookingModalContent = (offer: OfferResponseV2): ModalContent => {
  return {
    children: <AlreadyBooked offer={offer} />,
    title: 'Réservation impossible',
    leftIconAccessibilityLabel: undefined,
    leftIcon: undefined,
    onLeftIconPress: undefined,
  }
}

const getBookingImpossibleModalContent = (): ModalContent => {
  return {
    title: 'Tu y es presque',
    leftIconAccessibilityLabel: undefined,
    leftIcon: undefined,
    onLeftIconPress: undefined,
    children: <BookingImpossible />,
  }
}

const getNonEventModalContent = (
  stocks: OfferStockResponse[],
  onPressBookOffer: VoidFunction,
  isLoading?: boolean
): ModalContent => {
  return {
    title: 'Détails de la réservation',
    leftIconAccessibilityLabel: undefined,
    leftIcon: undefined,
    onLeftIconPress: undefined,
    children: (
      <BookingDetails stocks={stocks} isLoading={isLoading} onPressBookOffer={onPressBookOffer} />
    ),
  }
}

const getBookingStepModalContent = (
  modalLeftIconProps: ModalLeftIconProps,
  stocks: OfferStockResponse[],
  isDuo: boolean
): ModalContent => {
  return {
    title: 'Choix des options',
    ...modalLeftIconProps,
    children: <BookingEventChoices stocks={stocks} offerIsDuo={isDuo} />,
  }
}

const getBookingDetailsModalContent = (
  stocks: OfferStockResponse[],
  modalLeftIconProps: ModalLeftIconProps,
  onPressBookOffer: VoidFunction,
  isLoading?: boolean
): ModalContent => {
  return {
    title: 'Détails de la réservation',
    ...modalLeftIconProps,
    children: (
      <BookingDetails stocks={stocks} isLoading={isLoading} onPressBookOffer={onPressBookOffer} />
    ),
  }
}

export const useModalContent = (
  onPressBookOffer: VoidFunction,
  isLoading?: boolean,
  isEndedUsedBooking?: boolean,
  bookingDataMovieScreening?: MovieScreeningBookingData
): ModalContent => {
  const { bookingState, dispatch } = useBookingContext()
  const offer = useBookingOfferQuery()
  const mapping = useSubcategoriesMapping()
  const bookingStep = bookingState.step ?? Step.DATE

  if (!offer) {
    return getDefaultModalContent()
  }

  if (isEndedUsedBooking) {
    return getEndedUseBookingModalContent(offer)
  }

  const { isDigital, stocks } = offer
  const subcategory = mapping[offer.subcategoryId]

  const goToPreviousStep = (step: Step) => {
    dispatch({ type: 'CHANGE_STEP', payload: step })
  }

  if (!subcategory.isEvent) {
    if (
      isDigital &&
      subcategory.categoryId !== CategoryIdEnum.CINEMA &&
      Platform.OS === 'ios' &&
      getOfferPrice(stocks) > 0
    ) {
      return getBookingImpossibleModalContent()
    }

    return getNonEventModalContent(stocks, onPressBookOffer, isLoading)
  }

  if (bookingState.step !== Step.CONFIRMATION) {
    const shouldDisplayBackButton = bookingStep !== Step.DATE && !bookingDataMovieScreening
    const bookingStepModalLeftIconProps: ModalLeftIconProps = shouldDisplayBackButton
      ? {
          leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
          leftIcon: ArrowPrevious,
          onLeftIconPress: () =>
            goToPreviousStep(getPreviousStep(bookingState, offer?.stocks || [], offer?.isDuo)),
        }
      : {
          leftIconAccessibilityLabel: undefined,
          leftIcon: undefined,
          onLeftIconPress: undefined,
        }
    return getBookingStepModalContent(bookingStepModalLeftIconProps, stocks, offer.isDuo)
  }

  const previousBookingState = getPreviousStep(
    bookingState,
    offer?.stocks || [],
    offer?.isDuo,
    bookingDataMovieScreening
  )
  const bookingDetailsModalLeftIconProps: ModalLeftIconProps = {
    leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
    leftIcon: ArrowPrevious,
    onLeftIconPress: () => goToPreviousStep(previousBookingState),
  }

  return getBookingDetailsModalContent(
    stocks,
    bookingDetailsModalLeftIconProps,
    onPressBookOffer,
    isLoading
  )
}
