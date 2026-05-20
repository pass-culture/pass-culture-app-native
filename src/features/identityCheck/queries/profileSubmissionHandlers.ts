import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { ProfileOrigin } from 'features/identityCheck/pages/profile/types'
import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

type OfferNavigation = NativeStackNavigationProp<RootStackParamList, 'Offer'>

type Params = {
  isBookingFreeOffer: boolean
  freeOfferId?: number | null
  profileOrigin?: ProfileOrigin
  reset: OfferNavigation['reset']
}

type SuccessParams = Params & {
  navigateForwardToStepper: () => void
  refetchUser: () => void
}

function handleFreeOfferProfileSuccess({
  freeOfferId,
  profileOrigin,
  reset,
}: Pick<SuccessParams, 'freeOfferId' | 'profileOrigin' | 'reset'>) {
  const isFromOffer = profileOrigin === ProfileOrigin.OFFER && !!freeOfferId

  if (isFromOffer) {
    reset({ routes: [{ name: 'Offer', params: { id: freeOfferId } }] })
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
    freeOfferId,
    navigateForwardToStepper,
    refetchUser,
  } = params

  if (isBookingFreeOffer) {
    handleFreeOfferProfileSuccess({ freeOfferId, profileOrigin, reset })
  } else {
    handleStandardProfileSuccess({ navigateForwardToStepper })
  }

  resetProfileStores()
  refetchUser()
}

function handleFreeOfferProfileError({
  freeOfferId,
  reset,
}: Pick<Params, 'freeOfferId' | 'reset'>) {
  if (freeOfferId) {
    reset({
      routes: [
        {
          name: 'SubscriptionStackNavigator',
          state: {
            routes: [{ name: 'SetProfileBookingError', params: { offerId: freeOfferId } }],
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
  const { isBookingFreeOffer, reset, freeOfferId } = params

  if (isBookingFreeOffer) {
    handleFreeOfferProfileError({ freeOfferId, reset })
  } else {
    showErrorSnackBar('Une erreur est survenue lors de la mise à jour de ton profil')
  }
}
