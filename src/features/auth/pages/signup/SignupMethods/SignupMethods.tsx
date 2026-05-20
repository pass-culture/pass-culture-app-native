import { useRoute, useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SSOButtonApple } from 'features/auth/components/SSOButton/SSOButtonApple'
import { SSOButtonGoogle } from 'features/auth/components/SSOButton/SSOButtonGoogle'
import { getSSOErrorMessage } from 'features/auth/helpers/getSSOErrorMessage'
import { SignInResponseFailure } from 'features/auth/types'
import {
  StepperOrigin,
  UseNavigationType,
  UseRouteType,
} from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { StepperValidate } from 'ui/svg/icons/StepperValidate'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = { onSSOEmailNotFoundError: () => void }

const DEFAULT_ERROR_MESSAGE = 'Erreur lors de la tentative de connexion'

const SSO_ERROR_MESSAGES: Partial<Record<string, string>> = {
  NETWORK_REQUEST_FAILED: 'Erreur réseau. Tu peux réessayer une fois la connexion réétablie.',
  TOO_MANY_ATTEMPTS: 'Nombre de tentatives dépassé. Réessaye dans 1 minute.',
}

export const SignupMethods: FunctionComponent<Props> = ({ onSSOEmailNotFoundError }) => {
  const { params } = useRoute<UseRouteType<'SignupMethods'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const enableAppleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO)

  const onLogLoginAnalytics = useCallback(() => {
    void analytics.logLoginClicked({ from: 'SignupMethods' })
  }, [])

  const onSSOSignUpFailure = useCallback(
    (response: SignInResponseFailure) => {
      const failureCode = response.content?.code

      if (failureCode === 'SSO_EMAIL_NOT_FOUND') {
        onSSOEmailNotFoundError()
        return navigate('SignupForm', {
          accountCreationToken: response.content?.accountCreationToken,
          email: response.content?.email,
          from: StepperOrigin.SIGNUP_METHODS,
          ssoProvider: response.provider,
        })
      }

      if (failureCode === 'SSO_ERROR') {
        return showErrorSnackBar(getSSOErrorMessage(response.provider, 'signup'))
      }

      const isRateLimited = response.statusCode === 429 || failureCode === 'TOO_MANY_ATTEMPTS'
      const key = isRateLimited ? 'TOO_MANY_ATTEMPTS' : failureCode
      const APIMessage = key && SSO_ERROR_MESSAGES[key]
      const SSOMessage = getSSOErrorMessage(response.provider, 'signup')
      const message = APIMessage ?? SSOMessage ?? DEFAULT_ERROR_MESSAGE

      showErrorSnackBar(message)
    },
    [navigate, onSSOEmailNotFoundError]
  )

  return (
    <PageWithHeader
      shouldDisplayBackButton
      title="Inscription"
      scrollChildren={
        <React.Fragment>
          <TitleContainer>
            <Typo.Title3 {...getHeadingAttrs(2)}>Crée-toi un compte</Typo.Title3>
          </TitleContainer>
          <SeparatorWithText label="Méthode recommandée" icon={StepperValidate} color="primary" />
          <StyledViewGap gap={4}>
            <SSOButtonGoogle type="signup" onSignInFailure={onSSOSignUpFailure} />
            {enableAppleSSO ? (
              <SSOButtonApple type="signup" onSignInFailure={onSSOSignUpFailure} />
            ) : null}
            <SeparatorWithText label="ou" />
            <InternalTouchableLink
              as={Button}
              variant="secondary"
              color="neutral"
              icon={EmailFilled}
              wording="S’inscrire avec mon e-mail"
              navigateTo={{ screen: 'SignupForm', params }}
            />
          </StyledViewGap>
        </React.Fragment>
      }
      fixedBottomChildren={<SignUpButton type="login" onAdditionalPress={onLogLoginAnalytics} />}
    />
  )
}

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.xxxl,
}))

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const SignUpButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``
