import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type OfferNavigation = NativeStackNavigationProp<RootStackParamList, 'Offer'>

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

function handleFreeOfferProfileSuccess({
  storedFreeOfferId,
  reset,
}: Pick<SuccessParams, 'storedFreeOfferId' | 'reset'>) {
  if (storedFreeOfferId) {
    reset({ routes: [{ name: 'Offer', params: { id: storedFreeOfferId } }] })
  } else {
    reset({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: {
            routes: [{ name: 'SetProfileBookingError' }],
          },
        },
      ],
    })
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
}: Pick<Params, 'storedFreeOfferId' | 'reset'>) {
  if (storedFreeOfferId) {
    reset({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: {
            routes: [{ name: 'SetProfileBookingError', params: { offerId: storedFreeOfferId } }],
          },
        },
      ],
    })
  } else {
    reset({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: {
            routes: [{ name: 'SetProfileBookingError' }],
          },
        },
      ],
    })
  }
}

export function handlePostProfileError(params: Params) {
  const { isBookingFreeOffer, enableBookingFreeOfferFifteenSixteen, reset, storedFreeOfferId } =
    params

  if (isBookingFreeOffer && enableBookingFreeOfferFifteenSixteen) {
    handleFreeOfferProfileError({ storedFreeOfferId, reset })
  } else {
    showErrorSnackBar('Une erreur est survenue lors de la mise à jour de ton profil')
  }
}
