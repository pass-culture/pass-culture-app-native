import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'

import {
  HomeStackParamList,
  navigateToHomeWithoutModal,
} from 'features/home/navigation/HomeNavigator'
import { _ } from 'libs/i18n'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Email } from 'ui/svg/icons/Email'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

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

  return (
    <GenericInfoPage title={_(t`Oups`)} icon={SadFace}>
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
      <ButtonPrimaryWhite title={_(t`Renvoyer l'email`)} onPress={resendEmailForResetPassword} />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite
        title={_(t`Retourner à l'accueil`)}
        onPress={navigateToHomeWithoutModal}
      />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
