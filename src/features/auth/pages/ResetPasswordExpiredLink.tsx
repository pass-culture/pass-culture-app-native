import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Alert, ScrollView, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { HomeStackParamList } from 'features/home/navigation/HomeNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { SafeContainer } from 'ui/components/SafeContainer'
import { Background } from 'ui/svg/Background'
import { Email } from 'ui/svg/icons/Email'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { requestPasswordReset } from '../api'

import { contactSupport } from './support.services'

type Props = StackScreenProps<HomeStackParamList, 'ResetPasswordExpiredLink'>

export function ResetPasswordExpiredLink(props: Props) {
  async function resendEmailForResetPassword() {
    const { email } = props.route.params
    await requestPasswordReset({ email })
      .then(() => {
        props.navigation.navigate('ResetPasswordEmailSent', { email })
      })
      .catch((error) => {
        Alert.alert(error.message)
      })
  }

  function goBackToHome() {
    props.navigation.navigate('Home', { shouldDisplayLoginModal: false })
  }

  return (
    <SafeContainer noTabBarSpacing>
      <Background />
      <ScrollView contentContainerStyle={scrollViewContentContainerStyle}>
        <StyledView>
          <Spacer.Column numberOfSpaces={18} />
          <SadFace color={ColorsEnum.WHITE} size={100} />
          <Spacer.Column numberOfSpaces={9} />
          <StyledTitle2>{_(t`Oups`)}</StyledTitle2>
          <Spacer.Column numberOfSpaces={5} />
          <StyledBody>{_(t`Le lien est expiré !`)}</StyledBody>
          <StyledBody>
            {_(t`Clique sur « Renvoyer l’e-mail » pour recevoir un nouveau lien.`)}
          </StyledBody>
          <Spacer.Column numberOfSpaces={4} />
          <StyledBody>{_(t`Si tu as besoin d’aide n’hésite pas à :`)}</StyledBody>
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryWhite
            title={_(t`Contacter le support`)}
            onPress={contactSupport}
            icon={Email}
          />
          <Spacer.Column numberOfSpaces={4} />
          <ButtonPrimaryWhite
            title={_(t`Renvoyer l'email`)}
            onPress={resendEmailForResetPassword}
          />
          <Spacer.Column numberOfSpaces={4} />
          <ButtonTertiaryWhite title={_(t`Retourner à l'accueil`)} onPress={goBackToHome} />
        </StyledView>
      </ScrollView>
      <Spacer.TabBar />
    </SafeContainer>
  )
}

const scrollViewContentContainerStyle: ViewStyle = {
  flexGrow: 1,
  justifyContent: 'center',
}

const StyledView = styled.View({
  flexDirection: 'column',
  alignSelf: 'center',
  alignItems: 'center',
  width: '90%',
  maxWidth: getSpacing(125),
})

const StyledTitle2 = styled(Typo.Title2).attrs({
  color: ColorsEnum.WHITE,
})({})

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
