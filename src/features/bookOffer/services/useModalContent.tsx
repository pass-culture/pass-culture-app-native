import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'

import { CategoryNameEnum, CategoryType } from 'api/gen'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { getOfferPrice } from 'features/offer/services/getOfferPrice'
import { ModalLeftIconProps } from 'ui/components/modals/types'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

import { BookingImpossible } from '../components/BookingImpossible'
import { useBooking, useBookingOffer } from '../pages/BookingOfferWrapper'
import { Step } from '../pages/reducer'

type ModalContent = {
  children: JSX.Element
  title: string
} & ModalLeftIconProps

export const useModalContent = (): ModalContent => {
  const { bookingState, dispatch } = useBooking()
  const offer = useBookingOffer()

  if (!offer)
    return {
      children: <React.Fragment />,
      title: '',
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
    }

  const { category, isDigital, stocks } = offer

  const goToPreviousStep = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.PRE_VALIDATION })
  }

  if (category.categoryType === CategoryType.Thing) {
    if (
      isDigital &&
      category.name !== CategoryNameEnum.CINEMA &&
      Platform.OS === 'ios' &&
      getOfferPrice(stocks) > 0
    ) {
      return {
        title: t`Tu y es presque`,
        leftIconAccessibilityLabel: undefined,
        leftIcon: undefined,
        onLeftIconPress: undefined,
        children: <BookingImpossible />,
      }
    }

    return {
      title: t`Détails de la réservation`,
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      children: <BookingDetails stocks={stocks} />,
    }
  }

  if (bookingState.step !== Step.CONFIRMATION) {
    return {
      title: t`Mes options`,
      leftIconAccessibilityLabel: undefined,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      children: <BookingEventChoices stocks={stocks} />,
    }
  }

  return {
    title: t`Détails de la réservation`,
    leftIconAccessibilityLabel: t`Revenir à l'étape précédente`,
    leftIcon: ArrowPrevious,
    onLeftIconPress: goToPreviousStep,
    children: <BookingDetails stocks={stocks} />,
  }
}
