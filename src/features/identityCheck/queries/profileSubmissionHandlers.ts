import { StackNavigationProp } from '@react-navigation/stack'

import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'

type OfferNavigation = StackNavigationProp<RootStackParamList, 'Offer'>

type Params = {
  isBookingFreeOffer: boolean
  enableBookingFreeOfferFifteenSixteen: boolean
  storedFreeOfferId?: number | null
  reset: OfferNavigation['reset']
}

type SuccessParams = Params & {
  navigateForwardToStepper: () => void
  refetchUser: () => void
}

type ErrorParams = Params & {
  showErrorSnackBar: (args: { message: string; timeout: number }) => void
  SNACK_BAR_TIME_OUT: number
}

function handleFreeOfferProfileSuccess({
  storedFreeOfferId,
  reset,
}: Pick<SuccessParams, 'storedFreeOfferId' | 'reset'>) {
  if (storedFreeOfferId) {
    reset({ routes: [{ name: 'Offer', params: { id: storedFreeOfferId } }] })
  } else {
    reset({ routes: [{ name: 'SetProfileBookingError' }] })
  }
}

function handleStandardProfileSuccess({
  navigateForwardToStepper,
}: Pick<SuccessParams, 'navigateForwardToStepper'>) {
  navigateForwardToStepper()
}

export function handlePostProfileSuccess(params: SuccessParams) {
  const {
    isBookingFreeOffer,
    enableBookingFreeOfferFifteenSixteen,
    reset,
    storedFreeOfferId,
    navigateForwardToStepper,
    refetchUser,
  } = params

  if (isBookingFreeOffer && enableBookingFreeOfferFifteenSixteen) {
    handleFreeOfferProfileSuccess({ storedFreeOfferId, reset })
  } else {
    handleStandardProfileSuccess({ navigateForwardToStepper })
  }

  resetProfileStores()
  refetchUser()
}

function handleFreeOfferProfileError({
  storedFreeOfferId,
  reset,
}: Pick<ErrorParams, 'storedFreeOfferId' | 'reset'>) {
  if (storedFreeOfferId) {
    reset({
      routes: [{ name: 'SetProfileBookingError', params: { offerId: storedFreeOfferId } }],
    })
  } else {
    reset({ routes: [{ name: 'SetProfileBookingError' }] })
  }
}

function handleStandardProfileError({
  showErrorSnackBar,
  SNACK_BAR_TIME_OUT,
}: Pick<ErrorParams, 'showErrorSnackBar' | 'SNACK_BAR_TIME_OUT'>) {
  showErrorSnackBar({
    message: 'Une erreur est survenue lors de la mise à jour de ton profil',
    timeout: SNACK_BAR_TIME_OUT,
  })
}

export function handlePostProfileError(params: ErrorParams) {
  const { isBookingFreeOffer, enableBookingFreeOfferFifteenSixteen, ...rest } = params

  if (isBookingFreeOffer && enableBookingFreeOfferFifteenSixteen) {
    handleFreeOfferProfileError(rest)
  } else {
    handleStandardProfileError(rest)
  }
}
