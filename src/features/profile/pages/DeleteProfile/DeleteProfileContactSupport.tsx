import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { TypoDS } from 'ui/theme'

import { nativeEmailProvider } from './EmailProvider'
import { useContactSupportForDeletionProfile } from './useContactSupportForDeletionProfile'
import { webEmailProvider } from './WebEmailProvider.web'

const isWeb = Platform.OS === 'web'

export const DeleteProfileContactSupport: FC = () => {
  const emailProvider = isWeb ? webEmailProvider() : nativeEmailProvider()
  const { requestSendMail } = useContactSupportForDeletionProfile({ emailProvider })
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getProfileStackConfig('Profile'))
  return (
    <GenericInfoPageWhite
      withGoBack
      illustration={BicolorEmailSent}
      title="Contacte le support"
      buttonPrimary={{
        wording: 'Contacter le support',
        onPress: requestSendMail,
        icon: Email,
      }}
      buttonTertiary={{
        wording: 'Retourner au profil',
        onPress: navigateToProfile,
        icon: PlainArrowNext,
      }}>
      <ViewGap gap={6}>
        <StyledBody>
          Pour traiter ta demande, nous te conseillons d’écrire à notre équipe support.
        </StyledBody>
        <StyledBody>
          Ta demande sera analysée et tu pourras être redirigé vers la meilleure solution.
        </StyledBody>
      </ViewGap>
    </GenericInfoPageWhite>
  )
}

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
