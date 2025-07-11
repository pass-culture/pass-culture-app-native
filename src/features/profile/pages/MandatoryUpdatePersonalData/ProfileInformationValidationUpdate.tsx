import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Summary } from 'features/identityCheck/components/Summary'
import { getActivityLabel } from 'features/identityCheck/helpers/getActivityLabel'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Again } from 'ui/svg/icons/Again'

export const ProfileInformationValidationUpdate = () => {
  const { user } = useAuthContext()
  const { navigate, reset } = useNavigation<UseNavigationType>()
  const { showErrorSnackBar } = useSnackBarContext()
  const [navigatorName, screenConfig] = getProfileStackConfig('UpdatePersonalDataConfirmation')

  const { mutate: patchProfile, isLoading } = usePatchProfileMutation({
    onSuccess: () => {
      reset({
        index: 1,
        routes: [
          { name: homeNavConfig[0], params: homeNavConfig[1] },
          { name: navigatorName, params: screenConfig },
        ],
      })
    },
    onError: () => {
      showErrorSnackBar({ message: 'Une erreur est survenue', timeout: SNACK_BAR_TIME_OUT })
    },
  })

  const onSubmitProfile = () =>
    patchProfile({
      address: user?.street,
      city: user?.city,
      postalCode: user?.postalCode,
      activityId: user?.activityId,
    })

  const onChangeInformation = () =>
    navigate(
      ...getProfileStackConfig('ChangeCity', {
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
      <ButtonPrimary
        type="submit"
        wording="Confirmer"
        onPress={onSubmitProfile}
        isLoading={isLoading}
      />
      <ButtonTertiaryBlack
        wording="Modifier mes informations"
        onPress={onChangeInformation}
        icon={Again}
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
    />
  )
}
