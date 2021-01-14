import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { NavigateToHomeWithoutModalOptions } from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Email } from 'ui/svg/icons/Email'
import { SadFace } from 'ui/svg/icons/SadFace'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { contactSupport } from '../support.services'

type Props = StackScreenProps<RootStackParamList, 'SignupConfirmationExpiredLink'>

export function SignupConfirmationExpiredLink(props: Props) {
  const { navigate } = useNavigation<UseNavigationType>()

  function goToHomeWithoutModal() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }

  async function resendEmailForSignupConfirmation() {
    const { email } = props.route.params
    analytics.logResendEmailSignupConfirmationExpiredLink()
    await api
      .postnativev1resendEmailValidation({ email })
      .then(() => {
        navigate('SignupConfirmationEmailSent', { email })
      })
      .catch((error) => {
        // TODO: https://passculture.atlassian.net/browse/PC-5619
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
        onPress={() => contactSupport.forSignupConfirmationExpiredLink(props.route.params.email)}
        icon={Email}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonPrimaryWhite
        title={_(t`Renvoyer l'email`)}
        onPress={resendEmailForSignupConfirmation}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryWhite title={_(t`Retourner à l'accueil`)} onPress={goToHomeWithoutModal} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
