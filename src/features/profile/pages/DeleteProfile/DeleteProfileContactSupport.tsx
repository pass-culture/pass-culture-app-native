import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Email } from 'ui/svg/icons/Email'
import { EmailSent as InitialEmailSent } from 'ui/svg/icons/EmailSent'
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

  const navigateToProfile = () => navigate(...getTabHookConfig('Profile'))
  return (
    <GenericInfoPage
      withGoBack
      illustration={EmailSent}
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

const EmailSent = styled(InitialEmailSent).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
