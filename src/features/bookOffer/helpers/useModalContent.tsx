import React from 'react'
import { Platform } from 'react-native'

import { CategoryIdEnum } from 'api/gen'
import { AlreadyBooked } from 'features/bookOffer/components/AlreadyBooked'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { BookingImpossible } from 'features/bookOffer/components/BookingImpossible'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { getOfferPrice } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

type ModalContent = {
  children: JSX.Element
  title: string
} & ModalLeftIconProps

export const useModalContent = (isEndedUsedBooking?: boolean): ModalContent => {
  const { bookingState, dispatch } = useBookingContext()
  const offer = useBookingOffer()
  const mapping = useSubcategoriesMapping()

  if (!offer) {
    return {
      children: <React.Fragment />,
      title: '',
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
    }
  }

  if (isEndedUsedBooking) {
    return {
      children: <AlreadyBooked offer={offer} />,
      title: 'Réservation impossible',
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
    }
  }
  const { isDigital, stocks } = offer
  const subcategory = mapping[offer.subcategoryId]

  const goToPreviousStep = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.PRE_VALIDATION })
  }

  if (!subcategory.isEvent) {
    if (
      isDigital &&
      subcategory.categoryId !== CategoryIdEnum.CINEMA &&
      Platform.OS === 'ios' &&
      getOfferPrice(stocks) > 0
    ) {
      return {
        title: 'Tu y es presque',
        leftIconAccessibilityLabel: undefined,
        leftIcon: undefined,
        onLeftIconPress: undefined,
        children: <BookingImpossible />,
      }
    }

    return {
      title: 'Détails de la réservation',
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      children: <BookingDetails stocks={stocks} />,
    }
  }

  if (bookingState.step !== Step.CONFIRMATION) {
    return {
      title: 'Mes options',
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      children: <BookingEventChoices stocks={stocks} />,
    }
  }

  return {
    title: 'Détails de la réservation',
    leftIconAccessibilityLabel: 'Revenir à l’étape précédente',
    leftIcon: ArrowPrevious,
    onLeftIconPress: goToPreviousStep,
    children: <BookingDetails stocks={stocks} />,
  }
}
