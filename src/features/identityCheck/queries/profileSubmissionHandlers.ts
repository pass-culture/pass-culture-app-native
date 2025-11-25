import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type OfferNavigation = NativeStackNavigationProp<RootStackParamList, 'Offer'>

type Params = {
  isBookingFreeOffer: boolean
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
  const { isBookingFreeOffer, reset, storedFreeOfferId, navigateForwardToStepper, refetchUser } =
    params

  if (isBookingFreeOffer) {
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
  const { isBookingFreeOffer, reset, storedFreeOfferId } = params

  if (isBookingFreeOffer) {
    handleFreeOfferProfileError({ storedFreeOfferId, reset })
  } else {
    showErrorSnackBar('Une erreur est survenue lors de la mise à jour de ton profil')
  }
}
