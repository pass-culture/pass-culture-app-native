import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'

import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Clear } from 'ui/svg/icons/Clear'
import { Info } from 'ui/svg/icons/Info'
import { UserBlocked } from 'ui/svg/icons/UserBlocked'
import { Typo } from 'ui/theme'

export const DeleteProfileAccountHacked: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabHookConfig('Profile'))

  const navigateToSuspendAccount = () => {
    navigate(...getProfileHookConfig('SuspendAccountConfirmationWithoutAuthentication'))
  }

  return (
    <GenericInfoPage
      withGoBack
      illustration={UserBlocked}
      title="Sécurise ton compte"
      buttonPrimary={{ wording: 'Suspendre mon compte', onPress: navigateToSuspendAccount }}
      buttonTertiary={{
        wording: 'Ne pas sécuriser mon compte',
        onPress: navigateToProfile,
        icon: Clear,
      }}>
      <ViewGap gap={6}>
        <Typo.Body>
          Tu as indiqué
          <Typo.BodyAccent> que quelqu’un d’autre a accès à ton compte.</Typo.BodyAccent>
        </Typo.Body>
        <Typo.Body>
          Pour des raisons de <Typo.BodyAccent>sécurité</Typo.BodyAccent>, nous te conseillons de
          suspendre ton compte temporairement.
        </Typo.Body>
        <InfoBanner
          icon={Info}
          message="Tu recevras un e-mail pour t’indiquer les étapes à suivre pour récupérer ton compte"
        />
      </ViewGap>
    </GenericInfoPage>
  )
}
