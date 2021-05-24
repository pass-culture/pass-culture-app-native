import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'

import { CategoryNameEnum, CategoryType } from 'api/gen'
import { BookingDetails } from 'features/bookOffer/components/BookingDetails'
import { BookingEventChoices } from 'features/bookOffer/components/BookingEventChoices'
import { getOfferPrice } from 'features/offer/services/getOfferPrice'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { IconInterface } from 'ui/svg/icons/types'

import { BookingImpossible } from '../components/BookingImpossible'
import { useBooking, useBookingOffer } from '../pages/BookingOfferWrapper'
import { Step } from '../pages/reducer'

interface ModalContent {
  children: Element
  title: string
  leftIcon: React.FC<IconInterface> | undefined
  onLeftIconPress: (() => void) | undefined
}

export const useModalContent = (): ModalContent => {
  const { bookingState, dispatch } = useBooking()
  const offer = useBookingOffer()

  const children = <React.Fragment />
  const title = ''
  const leftIcon: React.FC<IconInterface> | undefined = undefined
  const onLeftIconPress = undefined

  if (!offer) return { children, title, leftIcon, onLeftIconPress }
  const { category, isDigital, stocks, name: categoryName } = offer

  const goToPreviousStep = () => {
    dispatch({ type: 'CHANGE_STEP', payload: Step.PRE_VALIDATION })
  }

  if (category.categoryType === CategoryType.Thing) {
    if (
      isDigital &&
      categoryName !== CategoryNameEnum.CINEMA &&
      Platform.OS === 'ios' &&
      getOfferPrice(stocks) > 0
    ) {
      return {
        title: t`Tu y es presque`,
        leftIcon: undefined,
        onLeftIconPress: undefined,
        children: <BookingImpossible />,
      }
    }

    return {
      title: t`Détails de la réservation`,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      children: <BookingDetails stocks={stocks} />,
    }
  }

  if (bookingState.step !== Step.CONFIRMATION) {
    return {
      title: t`Mes options`,
      leftIcon: undefined,
      onLeftIconPress: undefined,
      children: <BookingEventChoices stocks={stocks} />,
    }
  }

  return {
    title: t`Détails de la réservation`,
    leftIcon: ArrowPrevious,
    onLeftIconPress: goToPreviousStep,
    children: <BookingDetails stocks={stocks} />,
  }
}
