import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { Email } from 'ui/svg/icons/Email'
import { Typo, TypoDS, getSpacing } from 'ui/theme'

import { nativeEmailProvider } from './EmailProvider'
import { useContactSupportForDeletionProfile } from './useContactSupportForDeletionProfile'
import { webEmailProvider } from './WebEmailProvider.web'

export const DeleteProfileContactSupport: FC = () => {
  const isWeb = Platform.OS === 'web'
  const emailProvider = isWeb ? webEmailProvider() : nativeEmailProvider()
  const { openMail } = useContactSupportForDeletionProfile({ emailProvider })
  const { navigate } = useNavigation<UseNavigationType>()

  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))
  return (
    <GenericInfoPageWhite
      headerGoBack
      separateIconFromTitle={false}
      icon={BicolorEmailSent}
      titleComponent={TypoDS.Title2}
      title="Contacte le support">
      <Content>
        <ContentBody>
          <TypoDS.BodyS>
            Pour traiter ta demande, nous te conseillons d’écrire à notre équipe support.
          </TypoDS.BodyS>
          <TypoDS.BodyS>
            Ta demande sera analysée et tu pourras être redirigé vers la meilleure solution.
          </TypoDS.BodyS>
        </ContentBody>

        <ContentBottom>
          <ButtonPrimary icon={Email} wording="Contacter le support" onPress={openMail} />
          <Typo.ButtonText onPress={navigateToProfile}>Retourner au profile</Typo.ButtonText>
        </ContentBottom>
      </Content>
    </GenericInfoPageWhite>
  )
}

const Content = styled.View({
  gap: getSpacing(8),
})

const ContentBody = styled.View({
  gap: getSpacing(6),
})

const ContentBottom = styled.View({
  alignItems: 'center',
  gap: getSpacing(6),
})
