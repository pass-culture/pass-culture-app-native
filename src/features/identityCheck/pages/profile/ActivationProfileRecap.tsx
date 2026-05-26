import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Summary } from 'features/identityCheck/components/Summary'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName } from 'features/identityCheck/pages/profile/store/nameStore'
import { usePhoneNumber } from 'features/identityCheck/pages/profile/store/phoneNumberStore'
import { useStatus } from 'features/identityCheck/pages/profile/store/statusStore'
import { shouldProvidePhoneNumber } from 'features/identityCheck/pages/profile/utils'
import {
  handlePostProfileSuccess,
  handlePostProfileError,
} from 'features/identityCheck/queries/profileSubmissionHandlers'
import { usePostProfileMutation } from 'features/identityCheck/queries/usePostProfileMutation'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'

export const ActivationProfileRecap = () => {
  const { params } = useRoute<UseRouteType<'ActivationProfileRecap'>>()
  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario
  const profileOrigin = params?.origin
  const freeOfferId = params?.freeOfferId
  const isBookingFreeOffer = type === ProfileTypes.BOOKING_FREE_OFFER_15_16
  const { user } = useAuthContext()
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
  const storedPhoneNumber = usePhoneNumber()
  const storedStatus = useStatus()
  const phoneNumberInProfileStepper = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_PHONE_NUMBER_IN_PROFILE_STEPPER
  )
  const hasMissingData =
    !storedName?.lastName ||
    !storedName?.firstName ||
    !storedAddress ||
    !storedCity ||
    !storedStatus ||
    (phoneNumberInProfileStepper &&
      shouldProvidePhoneNumber(user) &&
      !storedPhoneNumber?.phoneNumber)
  const saveStep = useSaveStep()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()

  const { mutateAsync: postProfile } = usePostProfileMutation({
    onSuccess: () =>
      handlePostProfileSuccess({
        isBookingFreeOffer,
        profileOrigin,
        freeOfferId,
        navigateForwardToStepper,
        reset,
        refetchUser,
      }),
    onError: () =>
      handlePostProfileError({
        isBookingFreeOffer,
        freeOfferId,
        reset,
      }),
  })

  const [isPending, setIsPending] = useState(false)

  const phoneNumberWithPrefix =
    storedPhoneNumber?.phoneNumber && storedPhoneNumber?.countryId
      ? (() => {
          const country = findCountry(storedPhoneNumber.countryId)
          return country
            ? formatPhoneNumberWithPrefix(storedPhoneNumber.phoneNumber, country.callingCode)
            : null
        })()
      : null

  const submit = async () => {
    const baseprofile = {
      name: storedName,
      city: storedCity,
      address: storedAddress,
      status: storedStatus,
      hasSchoolTypes: false,
      schoolType: null,
    }
    const profile = phoneNumberWithPrefix
      ? { ...baseprofile, phoneNumber: phoneNumberWithPrefix }
      : baseprofile
    setIsPending(true)
    await postProfile(profile)
    await saveStep(IdentityCheckStep.PROFILE)
    setIsPending(false)
  }

  const updateInformation = () =>
    navigate(
      ...getSubscriptionHookConfig(
        'SetName',
        (() => {
          if (profileOrigin) {
            return freeOfferId
              ? { type, origin: profileOrigin, freeOfferId }
              : { type, origin: profileOrigin }
          }
          return freeOfferId ? { type, freeOfferId } : { type }
        })()
      )
    )

  const noDataMessage = 'Information manquante'
  const baseRecapData = [
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
  ]

  const recapData = [
    ...baseRecapData,
    ...(shouldProvidePhoneNumber(user) && phoneNumberInProfileStepper
      ? [
          {
            title: 'Numéro de téléphone',
            value: phoneNumberWithPrefix ?? noDataMessage,
          },
        ]
      : []),
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
          <Button wording="Compléter les informations" onPress={updateInformation} />
        ) : (
          <ViewGap gap={4}>
            <Button
              isLoading={isPending}
              wording="Confirmer"
              accessibilityLabel="Confirmer et envoyer les informations"
              onPress={submit}
            />
            <Button
              variant="secondary"
              wording="Modifier mes informations"
              onPress={updateInformation}
            />
          </ViewGap>
        )
      }
    />
  )
}
