import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo } from 'ui/theme'

import { nativeEmailProvider } from './EmailProvider'
import { getContactSupportForDeletionProfile } from './getContactSupportForDeletionProfile'
import { webEmailProvider } from './WebEmailProvider.web'

const isWeb = Platform.OS === 'web'

export const DeleteProfileContactSupport: FC = () => {
  const emailProvider = isWeb ? webEmailProvider() : nativeEmailProvider()
  const { requestSendMail } = getContactSupportForDeletionProfile({ emailProvider })
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))
  return (
    <GenericInfoPage
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
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
