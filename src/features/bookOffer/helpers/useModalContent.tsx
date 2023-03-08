import React from 'react'
import { Platform } from 'react-native'

import { CategoryIdEnum, OfferResponse, OfferStockResponse } from 'api/gen'
import { AlreadyBooked } from 'features/bookOffer/components/AlreadyBooked'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { BookingImpossible } from 'features/bookOffer/components/BookingImpossible'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { getPreviousStep } from 'features/bookOffer/helpers/bookingHelpers/bookingHelpers'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

type ModalContent = {
  children: JSX.Element
  title: string
} & ModalLeftIconProps

const getDefaultModalContent = (): ModalContent => {
  return {
    children: <React.Fragment />,
    title: '',
    leftIconAccessibilityLabel: undefined,
    leftIcon: undefined,
    onLeftIconPress: undefined,
  }
}

const getEndedUseBookingModalContent = (offer: OfferResponse): ModalContent => {
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

const getNonEventModalContent = (stocks: OfferStockResponse[]): ModalContent => {
  return {
    title: 'Détails de la réservation',
    leftIconAccessibilityLabel: undefined,
    leftIcon: undefined,
    onLeftIconPress: undefined,
    children: <BookingDetails stocks={stocks} />,
  }
}

const getBookingStepModalContent = (
  enablePricesByCategories: boolean,
  modalLeftIconProps: ModalLeftIconProps,
  stocks: OfferStockResponse[],
  isDuo: boolean
): ModalContent => {
  return {
    title: enablePricesByCategories ? 'Choix des options' : 'Mes options',
    ...modalLeftIconProps,
    children: (
      <BookingEventChoices
        stocks={stocks}
        offerIsDuo={isDuo}
        enablePricesByCategories={enablePricesByCategories}
      />
    ),
  }
}

const getBookingDetailsModalContent = (
  stocks: OfferStockResponse[],
  modalLeftIconProps: ModalLeftIconProps
): ModalContent => {
  return {
    title: 'Détails de la réservation',
    ...modalLeftIconProps,
    children: <BookingDetails stocks={stocks} />,
  }
}

export const useModalContent = (isEndedUsedBooking?: boolean): ModalContent => {
  const { bookingState, dispatch } = useBookingContext()
  const offer = useBookingOffer()
  const mapping = useSubcategoriesMapping()
  const enablePricesByCategories = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRICES_BY_CATEGORIES)
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

    return getNonEventModalContent(stocks)
  }

  if (bookingState.step !== Step.CONFIRMATION) {
    const shouldDisplayBackButton = bookingStep !== Step.DATE && enablePricesByCategories
    const bookingStepModalLeftIconProps: ModalLeftIconProps = shouldDisplayBackButton
      ? {
          leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
          leftIcon: ArrowPrevious,
          onLeftIconPress: () => goToPreviousStep(getPreviousStep(bookingStep, offer)),
        }
      : {
          leftIconAccessibilityLabel: undefined,
          leftIcon: undefined,
          onLeftIconPress: undefined,
        }
    return getBookingStepModalContent(
      enablePricesByCategories,
      bookingStepModalLeftIconProps,
      stocks,
      offer.isDuo
    )
  }

  const previousBookingState = getPreviousStep(bookingStep, offer)
  const bookingDetailsModalLeftIconProps: ModalLeftIconProps = {
    leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
    leftIcon: ArrowPrevious,
    onLeftIconPress: () =>
      goToPreviousStep(enablePricesByCategories ? previousBookingState : Step.PRE_VALIDATION),
  }

  return getBookingDetailsModalContent(stocks, bookingDetailsModalLeftIconProps)
}
