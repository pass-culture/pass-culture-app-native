import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'

import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { Clear } from 'ui/svg/icons/Clear'
import { BicolorUserBlocked } from 'ui/svg/icons/UserBlocked'
import { TypoDS } from 'ui/theme'

export const DeleteProfileEmailHacked: FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))

  const navigateToChangeEmail = () => navigate(...getProfileStackConfig('ChangeEmail'))

  const navigateToSuspendAccount = () => {
    navigate(...getProfileStackConfig('SuspendAccountConfirmationWithoutAuthentication'))
  }

  return (
    <GenericInfoPageWhite
      withGoBack
      illustration={BicolorUserBlocked}
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
        <TypoDS.BodyS>
          Tu as indiqué <TypoDS.BodyAccentS>que ta boite mail a été piratée</TypoDS.BodyAccentS>.
        </TypoDS.BodyS>
        <TypoDS.BodyS>
          Pour des raisons de <TypoDS.BodyAccentS>sécurité</TypoDS.BodyAccentS>, nous te conseillons
          de modifier ton mot de passe ou suspendre ton compte temporairement.
        </TypoDS.BodyS>
      </ViewGap>
    </GenericInfoPageWhite>
  )
}
