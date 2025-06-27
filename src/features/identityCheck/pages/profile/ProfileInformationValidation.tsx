import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Summary } from 'features/identityCheck/components/Summary'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { useStoredProfileInfos } from 'features/identityCheck/pages/helpers/useStoredProfileInfos'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import {
  handlePostProfileError,
  handlePostProfileSuccess,
} from 'features/identityCheck/queries/profileSubmissionHandlers'
import { usePostProfileMutation } from 'features/identityCheck/queries/usePostProfileMutation'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useFreeOfferId } from 'features/offer/store/freeOfferIdStore'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Again } from 'ui/svg/icons/Again'

export const ProfileInformationValidation = () => {
  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )

  const { refetchUser } = useAuthContext()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const { showErrorSnackBar } = useSnackBarContext()

  const { navigate, reset } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ProfileInformationValidation'>>()
  const type = params.type
  const isBookingFreeOffer = type === ProfileTypes.BOOKING_FREE_OFFER_15_16
  const isIdentityCheck = type === ProfileTypes.IDENTITY_CHECK
  const pageInfos = isIdentityCheck
    ? {
        headerTitle: 'Profil',
        navigateParamsType: ProfileTypes.IDENTITY_CHECK,
      }
    : {
        headerTitle: 'Informations personnelles',
        navigateParamsType: ProfileTypes.BOOKING_FREE_OFFER_15_16,
      }

  const storedProfileInfos = useStoredProfileInfos()
  const saveStep = useSaveStep()
  const storedFreeOfferId = useFreeOfferId()
  const fullStoredCity = storedProfileInfos?.city
    ? `${storedProfileInfos.city.name} ${storedProfileInfos.city.postalCode}`
    : undefined

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

  // isLoading from react-query is not support with mutateAsync
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const submitProfileInfo = useCallback(async () => {
    if (!storedProfileInfos) return

    const profile = { ...storedProfileInfos, hasSchoolTypes: false, schoolType: null }
    setIsLoading(true)
    await postProfile(profile)
    await saveStep(IdentityCheckStep.PROFILE)
    setIsLoading(false)
  }, [postProfile, saveStep, storedProfileInfos])

  const onSubmitProfile = () => submitProfileInfo()
  const onChangeInformation = () => navigate('SetName', { type: pageInfos.navigateParamsType })

  return (
    <PageWithHeader
      title={pageInfos.headerTitle}
      scrollChildren={
        <Summary
          title="Tu valides que ces informations sont correctes&nbsp;?"
          data={[
            {
              title: 'Ton prénom',
              testID: 'validation-first-name',
              value: storedProfileInfos?.name.firstName,
            },
            {
              title: 'Ton nom de famille',
              testID: 'validation-name',
              value: storedProfileInfos?.name.lastName,
            },
            { title: 'Adresse', value: storedProfileInfos?.address },
            {
              title: 'Ville de résidence',
              testID: 'validation-birth-date',
              value: fullStoredCity,
            },
            { title: 'Statut', value: getActivityLabel(storedProfileInfos?.status) },
          ]}
        />
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <ButtonPrimary
            type="submit"
            wording="Continuer"
            onPress={onSubmitProfile}
            isLoading={isLoading}
          />
          <ButtonTertiaryBlack
            wording="Modifier mes informations"
            onPress={onChangeInformation}
            icon={Again}
          />
        </ViewGap>
      }
    />
  )
}
