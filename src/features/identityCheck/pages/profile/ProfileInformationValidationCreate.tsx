import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'

import { ActivityIdEnum } from 'api/gen'
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
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { useFreeOfferId } from 'features/offer/store/freeOfferIdStore'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SuggestedCity } from 'libs/place/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Again } from 'ui/svg/icons/Again'

export const ProfileInformationValidationCreate = () => {
  const enableBookingFreeOfferFifteenSixteen = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_BOOKING_FREE_OFFER_15_16
  )

  const { refetchUser, user } = useAuthContext()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const { showErrorSnackBar } = useSnackBarContext()

  const { navigate, reset } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ProfileInformationValidationCreate'>>()
  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario
  const isBookingFreeOffer = type === ProfileTypes.BOOKING_FREE_OFFER_15_16

  enum DataSources {
    LOCAL_STORAGE = 'localStorage',
    AUTH_CONTEXT = 'authContext',
  }

  const pageConfigByType = {
    [ProfileTypes.IDENTITY_CHECK]: {
      headerTitle: 'Profil',
      subtitle: 'Tu valides que ces informations sont correctes\u00a0?',
      formDataSource: DataSources.LOCAL_STORAGE,
    },
    [ProfileTypes.BOOKING_FREE_OFFER_15_16]: {
      headerTitle: 'Informations personnelles',
      subtitle: 'Tu valides que ces informations sont correctes\u00a0?',
      formDataSource: DataSources.LOCAL_STORAGE,
    },
    [ProfileTypes.RECAP_EXISTING_DATA]: {
      headerTitle: 'Informations personnelles',
      subtitle: 'Vérifie que ces informations sont correctes avant de continuer',
      formDataSource: DataSources.AUTH_CONTEXT,
    },
  }

  const storedProfileInfos = useStoredProfileInfos()
  const saveStep = useSaveStep()
  const storedFreeOfferId = useFreeOfferId()

  const shouldGetDataFromLocalStorage =
    pageConfigByType[type].formDataSource === DataSources.LOCAL_STORAGE
  const firstName = shouldGetDataFromLocalStorage
    ? storedProfileInfos?.name.firstName
    : user?.firstName
  const lastName = shouldGetDataFromLocalStorage
    ? storedProfileInfos?.name.lastName
    : user?.lastName
  const storedAddress = storedProfileInfos?.address ?? null
  const address = shouldGetDataFromLocalStorage ? storedAddress : user?.street
  const city = shouldGetDataFromLocalStorage ? storedProfileInfos?.city.name : user?.city
  const postalCode = shouldGetDataFromLocalStorage
    ? storedProfileInfos?.city.postalCode
    : user?.postalCode
  const activityId: ActivityIdEnum | null | undefined = shouldGetDataFromLocalStorage
    ? storedProfileInfos?.status
    : user?.activityId

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
    if (!firstName || !lastName || !city || !postalCode || !address || !activityId) return

    // What is 'code' in SuggestedCity? Should we get it from the backend?
    const cityForPost: SuggestedCity = { name: city, code: postalCode, postalCode }
    const profile = {
      name: {
        firstName,
        lastName,
      },
      city: cityForPost,
      address: address,
      status: activityId,
      hasSchoolTypes: false,
      schoolType: null,
    }

    setIsLoading(true)
    await postProfile(profile)
    await saveStep(IdentityCheckStep.PROFILE)
    setIsLoading(false)
  }, [activityId, address, city, firstName, lastName, postProfile, postalCode, saveStep])

  const onSubmitProfile = () => submitProfileInfo()
  const onChangeInformation = () => navigate(...getSubscriptionHookConfig('SetName', { type }))

  const cityLabel = city && postalCode ? `${city} ${postalCode}` : undefined
  const activityLabel = activityId ? getActivityLabel(activityId) : undefined

  return (
    <PageWithHeader
      title={pageConfigByType[type].headerTitle}
      scrollChildren={
        <Summary
          title={pageConfigByType[type].subtitle}
          data={[
            {
              title: 'Ton prénom',
              testID: 'validation-first-name',
              value: firstName,
            },
            {
              title: 'Ton nom de famille',
              testID: 'validation-name',
              value: lastName,
            },
            {
              title: 'Adresse',
              value: address,
            },
            {
              title: 'Ville de résidence',
              testID: 'validation-birth-date',
              value: cityLabel,
            },
            {
              title: 'Statut',
              value: activityLabel,
            },
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
