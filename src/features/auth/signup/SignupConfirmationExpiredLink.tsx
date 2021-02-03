import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { AsyncError } from 'features/errors/pages/AsyncErrorBoundary'
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
  const { email } = props.route.params
  const { refetch, isFetching } = useQuery(
    'signupConfirmationExpiredLink',
    signupConfirmationExpiredLinkQuery,
    {
      cacheTime: 0,
      enabled: false,
      onSuccess: () => {
        navigate('SignupConfirmationEmailSent', { email })
      },
    }
  )
  function goToHomeWithoutModal() {
    navigate('Home', NavigateToHomeWithoutModalOptions)
  }
  async function signupConfirmationExpiredLinkQuery() {
    try {
      analytics.logResendEmailSignupConfirmationExpiredLink()
      await api.postnativev1resendEmailValidation({ email })
    } catch (err) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', refetch)
    }
  }
  async function onSubmit() {
    await refetch()
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
      <ButtonPrimaryWhite title={_(t`Renvoyer l'email`)} onPress={onSubmit} disabled={isFetching} />
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
