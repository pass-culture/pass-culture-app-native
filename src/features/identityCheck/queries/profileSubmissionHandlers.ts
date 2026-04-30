import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { ProfileOrigin } from 'features/identityCheck/pages/profile/types'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type OfferNavigation = NativeStackNavigationProp<RootStackParamList, 'Offer'>

type Params = {
  isBookingFreeOffer: boolean
  storedFreeOfferId?: number | null
  profileOrigin?: ProfileOrigin
  reset: OfferNavigation['reset']
}

type SuccessParams = Params & {
  navigateForwardToStepper: () => void
  refetchUser: () => void
}

function handleFreeOfferProfileSuccess({
  storedFreeOfferId,
  profileOrigin,
  reset,
}: Pick<SuccessParams, 'storedFreeOfferId' | 'profileOrigin' | 'reset'>) {
  const isFromOffer = profileOrigin === ProfileOrigin.OFFER && !!storedFreeOfferId

  if (isFromOffer) {
    reset({ routes: [{ name: 'Offer', params: { id: storedFreeOfferId } }] })
    showSuccessSnackBar('Tout est prêt, à toi les offres gratuites\u00a0!')
    return
  }

  if (profileOrigin === ProfileOrigin.HOME_BANNER) {
    reset({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: {
            routes: [{ name: 'FreeBeneficiaryAccountCreated' }],
          },
        },
      ],
    })
    return
  }

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

function handleStandardProfileSuccess({
  navigateForwardToStepper,
}: Pick<SuccessParams, 'navigateForwardToStepper'>) {
  navigateForwardToStepper()
}

export function handlePostProfileSuccess(params: SuccessParams) {
  const {
    isBookingFreeOffer,
    reset,
    profileOrigin,
    storedFreeOfferId,
    navigateForwardToStepper,
    refetchUser,
  } = params

  if (isBookingFreeOffer) {
    handleFreeOfferProfileSuccess({ storedFreeOfferId, profileOrigin, reset })
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
