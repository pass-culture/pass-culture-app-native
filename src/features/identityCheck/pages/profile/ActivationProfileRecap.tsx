import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Summary } from 'features/identityCheck/components/Summary'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import {
  handlePostProfileSuccess,
  handlePostProfileError,
} from 'features/identityCheck/queries/profileSubmissionHandlers'
import { usePostProfileMutation } from 'features/identityCheck/queries/usePostProfileMutation'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { useFreeOfferId } from 'features/offer/store/freeOfferIdStore'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { useSnackBarContext, SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const ActivationProfileRecap = () => {
  const { params } = useRoute<UseRouteType<'ActivationProfileRecap'>>()
  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario
  const isBookingFreeOffer = type === ProfileTypes.BOOKING_FREE_OFFER_15_16

  const pageConfigByType = {
    [ProfileTypes.IDENTITY_CHECK]: 'Profil',
    [ProfileTypes.RECAP_EXISTING_DATA]: 'Profil',
    [ProfileTypes.BOOKING_FREE_OFFER_15_16]: 'Informations personnelles',
  }

  const { navigate, reset } = useNavigation<UseNavigationType>()
  const { refetchUser } = useAuthContext()
  const storedName = useName()
  const storedCity = useCity()
  const storedAddress = useAddress()
  const storedStatus = useStatus()
  const storedFreeOfferId = useFreeOfferId()

  const hasMissingData =
    !storedName?.lastName ||
    !storedName?.firstName ||
    !storedAddress ||
    !storedCity ||
    !storedStatus

  const saveStep = useSaveStep()
  const { showErrorSnackBar } = useSnackBarContext()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()

  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )

  const { mutateAsync: postProfile } = usePostProfileMutation({
    onSuccess: () =>
      handlePostProfileSuccess({
        isBookingFreeOffer,
        enableBookingFreeOfferFifteenSixteen,
        storedFreeOfferId,
        navigateForwardToStepper,
        reset,
        refetchUser,
      }),
    onError: () =>
      handlePostProfileError({
        isBookingFreeOffer,
        enableBookingFreeOfferFifteenSixteen,
        storedFreeOfferId,
        reset,
        showErrorSnackBar,
        SNACK_BAR_TIME_OUT,
      }),
  })

  const [isPending, setIsPending] = useState(false)

  const submit = async () => {
    const profile = {
      name: storedName,
      city: storedCity,
      address: storedAddress,
      status: storedStatus,
      hasSchoolTypes: false,
      schoolType: null,
    }
    setIsPending(true)
    await postProfile(profile)
    await saveStep(IdentityCheckStep.PROFILE)
    setIsPending(false)
  }

  const updateInformation = () => navigate(...getSubscriptionHookConfig('SetName', { type }))

  const noDataMessage = 'Information manquante'
  const recapData = [
    {
      title: 'Nom',
      value: storedName?.lastName ? storedName.lastName.toUpperCase() : noDataMessage,
    },
    {
      title: 'Prénom',
      value: storedName?.firstName ?? noDataMessage,
    },
    {
      title: 'Adresse',
      value: storedAddress ?? noDataMessage,
    },
    {
      title: 'Ville de résidence',
      value: storedCity ? `${storedCity.name} ${storedCity.postalCode}` : noDataMessage,
    },
    {
      title: 'Statut',
      value: storedStatus ? getActivityLabel(storedStatus) : noDataMessage,
    },
  ]

  return (
    <PageWithHeader
      title={pageConfigByType[type]}
      scrollChildren={
        <Summary
          title="Vérifie que ces informations sont correctes avant de continuer"
          data={recapData}
        />
      }
      fixedBottomChildren={
        hasMissingData ? (
          <ButtonPrimary wording="Compléter les informations" onPress={updateInformation} />
        ) : (
          <ViewGap gap={4}>
            <ButtonPrimary
              isLoading={isPending}
              wording="Confirmer"
              accessibilityLabel="Confirmer et envoyer les informations"
              onPress={submit}
            />
            <ButtonSecondary wording="Modifier les informations" onPress={updateInformation} />
          </ViewGap>
        )
      }
    />
  )
}
