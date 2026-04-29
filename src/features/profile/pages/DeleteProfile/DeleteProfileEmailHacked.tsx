import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'

import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Clear } from 'ui/svg/icons/Clear'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Typo } from 'ui/theme'

export const DeleteProfileEmailHacked: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabHookConfig('Profile'))

  const navigateToChangeEmail = () => navigate(...getProfileHookConfig('ChangeEmail'))

  const navigateToSuspendAccount = () => {
    navigate(...getProfileHookConfig('SuspendAccountConfirmationWithoutAuthentication'))
  }

  return (
    <GenericInfoPage
      withGoBack
      illustration={UserBlocked}
      title="Sécurise ton compte"
      buttonPrimary={{
        wording: 'Modifier mon adresse e-mail',
        onPress: navigateToChangeEmail,
      }}
      buttonSecondary={{
        wording: 'Suspendre mon compte',
        onPress: navigateToSuspendAccount,
      }}
      buttonTertiary={{
        wording: 'Ne pas sécuriser mon compte',
        onPress: navigateToProfile,
        icon: Clear,
      }}>
      <ViewGap gap={6}>
        <Typo.BodyS>
          Tu as indiqué <Typo.BodyAccentS>que ta boite mail a été piratée</Typo.BodyAccentS>.
        </Typo.BodyS>
        <Typo.BodyS>
          Pour des raisons de <Typo.BodyAccentS>sécurité</Typo.BodyAccentS>, nous te conseillons de
          modifier ton mot de passe ou suspendre ton compte temporairement.
        </Typo.BodyS>
      </ViewGap>
    </GenericInfoPage>
  )
}
