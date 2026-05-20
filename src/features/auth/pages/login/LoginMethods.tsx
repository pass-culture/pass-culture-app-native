import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { SSOButtonAppleBase } from 'features/auth/components/SSOButton/SSOButtonAppleBase'
import { SSOButtonGoogleBase } from 'features/auth/components/SSOButton/SSOButtonGoogleBase'
import { getSSOErrorMessage } from 'features/auth/helpers/getSSOErrorMessage'
import { useSignInMutation } from 'features/auth/queries/useSignInMutation'
import { SignInResponseFailure } from 'features/auth/types'
import {
  StepperOrigin,
  UseNavigationType,
  UseRouteType,
} from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Form } from 'ui/components/Form'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { StepperValidate } from 'ui/svg/icons/StepperValidate'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const LoginMethods = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'LoginMethods'>>()
  const enableAppleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO)

  const onLogSignUpAnalytics = useCallback(() => {
    void analytics.logSignUpClicked({ from: 'login' })
  }, [])

  useEffect(() => {
    if (params?.from) {
      void analytics.logStepperDisplayed(params.from, 'LoginMethods')
    }
  }, [params?.from])

  useEffect(() => {
    if (params?.displayForcedLoginHelpMessage) {
      showErrorSnackBar(
        'Pour sécuriser ton pass Culture, tu dois régulièrement confirmer tes identifiants.'
      )
      void analytics.logDisplayForcedLoginHelpMessage()
    }
  }, [params?.displayForcedLoginHelpMessage])

  const handleSigninFailure = useCallback(
    (response: SignInResponseFailure) => {
      const failureCode = response.content?.code

      if (failureCode === 'SSO_EMAIL_NOT_FOUND') {
        return navigate('SignupForm', {
          accountCreationToken: response.content?.accountCreationToken,
          email: response.content?.email,
          from: StepperOrigin.LOGIN,
          ssoProvider: response.provider,
        })
      }

      if (failureCode === 'SSO_ERROR') {
        return showErrorSnackBar(getSSOErrorMessage(response.provider, 'login'))
      }

      showErrorSnackBar('Erreur lors de la tentative de connexion')
    },
    [navigate]
  )

  const { mutate: signInGoogle } = useSignInMutation({
    params,
    doNotNavigateOnSigninSuccess: true,
    onFailure: handleSigninFailure,
    analyticsType: 'SSO_login',
    analyticsMethod: 'fromLoginGoogle',
  })

  const { mutate: signInApple } = useSignInMutation({
    params,
    doNotNavigateOnSigninSuccess: true,
    onFailure: handleSigninFailure,
    analyticsType: 'SSO_login',
    analyticsMethod: 'fromLoginApple',
  })

  return (
    <PageWithHeader
      shouldDisplayBackButton
      title="Connexion"
      scrollChildren={
        <React.Fragment>
          <TitleContainer>
            <Typo.Title3 {...getHeadingAttrs(2)}>Connecte-toi</Typo.Title3>
          </TitleContainer>
          <SeparatorWithText label="Méthode recommandée" icon={StepperValidate} color="primary" />
          <Form.MaxWidth>
            <StyledViewGap gap={4}>
              <SSOButtonGoogleBase type="login" onSuccess={signInGoogle} />
              {enableAppleSSO ? <SSOButtonAppleBase type="login" onSuccess={signInApple} /> : null}
              <ButtonContainer>
                <ExternalTouchableLink
                  as={Button}
                  variant="tertiary"
                  color="neutral"
                  icon={StyledExternalSiteFilled}
                  wording="Identifiants oubliés&nbsp;?"
                  externalNav={{
                    url: 'https://aide.passculture.app/hc/fr/articles/25838501009308--Jeunes-Tu-as-perdu-tes-identifiants-de-connexion-que-faire',
                  }}
                />
              </ButtonContainer>
              <SeparatorWithText label="ou" />
              <InternalTouchableLink
                as={Button}
                variant="secondary"
                color="neutral"
                icon={EmailFilled}
                wording="Continuer avec mon e-mail"
                navigateTo={{ screen: 'Login', params }}
              />
            </StyledViewGap>
          </Form.MaxWidth>
        </React.Fragment>
      }
      fixedBottomChildren={<SignUpButton type="signup" onAdditionalPress={onLogSignUpAnalytics} />}
    />
  )
}

const TitleContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.xxxl,
}))

const SignUpButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
  type: 'signup',
}))``

const ButtonContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.buttons.maxWidth,
}))

const StyledExternalSiteFilled = styled(ExternalSiteFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
