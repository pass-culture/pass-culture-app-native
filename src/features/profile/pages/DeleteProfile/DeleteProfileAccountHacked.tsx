import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'

import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Clear } from 'ui/svg/icons/Clear'
import { Info } from 'ui/svg/icons/Info'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { Typo } from 'ui/theme'

export const DeleteProfileAccountHacked: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getProfileStackConfig('Profile'))

  const navigateToSuspendAccount = () => {
    navigate(...getProfileStackConfig('SuspendAccountConfirmationWithoutAuthentication'))
  }

  return (
    <GenericInfoPageWhite
      withGoBack
      illustration={BicolorUserBlocked}
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
    </GenericInfoPageWhite>
  )
}
