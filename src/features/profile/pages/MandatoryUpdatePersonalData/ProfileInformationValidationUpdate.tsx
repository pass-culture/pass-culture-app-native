import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Summary } from 'features/identityCheck/components/Summary'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { resetProfileStores } from 'features/identityCheck/pages/profile/store/resetProfileStores'
import { usePostProfileMutation } from 'features/identityCheck/queries/usePostProfileMutation'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { SuggestedCity } from 'libs/place/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Again } from 'ui/svg/icons/Again'

export const ProfileInformationValidationUpdate = () => {
  const { user, refetchUser } = useAuthContext()
  const { navigate, reset } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()
  const [navigatorName, screenConfig] = getProfileHookConfig('UpdatePersonalDataConfirmation')

  // isPending from react-query is not support with mutateAsync
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: postProfile } = usePostProfileMutation({
    onSuccess: () => {
      reset({
        index: 1,
        routes: [
          { name: homeNavigationConfig[0], params: homeNavigationConfig[1] },
          { name: navigatorName, params: screenConfig },
        ],
      })
      resetProfileStores()
      refetchUser()
    },
    onError: () => {
      showErrorSnackBar({ message: 'Une erreur est survenue', timeout: SNACK_BAR_TIME_OUT })
    },
  })

  const onSubmitProfile = useCallback(async () => {
    if (
      !user?.firstName ||
      !user?.lastName ||
      !user?.city ||
      !user?.postalCode ||
      !user?.street ||
      !user?.activityId
    )
      return

    const cityForPost: SuggestedCity = {
      name: user.city,
      postalCode: user.postalCode,
      code: '', // not used in usePostProfileMutation but needed by typing
    }

    const profile = {
      name: { firstName: user.firstName, lastName: user.lastName },
      city: cityForPost,
      address: user.street,
      status: user.activityId,
      hasSchoolTypes: false,
      schoolType: null,
    }

    setIsLoading(true)
    await postProfile(profile)
    setIsLoading(false)
  }, [postProfile, user])

  const onChangeInformation = () =>
    navigate(
      ...getProfileHookConfig('ChangeCity', {
        type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA,
      })
    )

  const fullStoredCity =
    user?.city && user?.postalCode ? `${user.city} ${user.postalCode}` : undefined
  const isProfileIncomplete = !fullStoredCity || !user?.activityId || !user?.street
  const fixedBottomChildren = isProfileIncomplete ? (
    <ButtonPrimary
      wording="Compléter mes informations"
      onPress={onChangeInformation}
      icon={Again}
    />
  ) : (
    <ViewGap gap={4}>
      <ButtonPrimary wording="Modifier mes informations" onPress={onChangeInformation} />
      <ButtonSecondary
        type="submit"
        wording="Confirmer"
        onPress={onSubmitProfile}
        isLoading={isLoading}
      />
    </ViewGap>
  )

  return (
    <PageWithHeader
      title="Informations personnelles"
      scrollChildren={
        <Summary
          title="Ces informations sont-elles toujours exactes&nbsp;?"
          data={[
            { title: 'Adresse', value: user?.street },
            { title: 'Ville de résidence', testID: 'validation-birth-date', value: fullStoredCity },
            { title: 'Statut', value: getActivityLabel(user?.activityId) },
          ]}
        />
      }
      fixedBottomChildren={fixedBottomChildren}
      shouldDisplayBackButton={false}
    />
  )
}
