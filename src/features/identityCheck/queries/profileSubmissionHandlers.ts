// profileSubmissionHandlers.ts
import { StackNavigationProp } from '@react-navigation/stack'

import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'

type OfferNavigation = StackNavigationProp<RootStackParamList, 'Offer'>

type Params = {
  isBookingFreeOffer: boolean
  enableBookingFreeOfferFifteenSixteen: boolean
  storedFreeOfferId?: number | null
  navigateForwardToStepper: () => void
  reset: OfferNavigation['reset']
  refetchUser: () => void
}

export function handlePostProfileSuccess({
  isBookingFreeOffer,
  enableBookingFreeOfferFifteenSixteen,
  storedFreeOfferId,
  navigateForwardToStepper,
  reset,
  refetchUser,
}: Params) {
  if (isBookingFreeOffer && enableBookingFreeOfferFifteenSixteen) {
    if (storedFreeOfferId) {
      reset({ routes: [{ name: 'Offer', params: { id: storedFreeOfferId } }] })
    } else {
      reset({ routes: [{ name: 'SetProfileBookingError' }] })
    }
  } else {
    navigateForwardToStepper()
  }
  resetProfileStores()
  refetchUser()
}

type ErrorParams = {
  isBookingFreeOffer: boolean
  storedFreeOfferId?: number | null
  reset: OfferNavigation['reset']
  showErrorSnackBar: (args: { message: string; timeout: number }) => void
  SNACK_BAR_TIME_OUT: number
}

export function handlePostProfileError({
  isBookingFreeOffer,
  storedFreeOfferId,
  reset,
  showErrorSnackBar,
  SNACK_BAR_TIME_OUT,
}: ErrorParams) {
  if (isBookingFreeOffer) {
    if (storedFreeOfferId) {
      reset({
        routes: [{ name: 'SetProfileBookingError', params: { offerId: storedFreeOfferId } }],
      })
    } else {
      reset({ routes: [{ name: 'SetProfileBookingError' }] })
    }
  } else {
    showErrorSnackBar({
      message: 'Une erreur est survenue lors de la mise à jour de ton profil',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }
}
