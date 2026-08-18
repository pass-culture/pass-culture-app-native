import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { LastLoginInfoBanner } from 'features/auth/components/LastLoginInfoBanner'
import { SSOButtonAppleBase } from 'features/auth/components/SSOButton/SSOButtonAppleBase'
import { SSOButtonGoogleBase } from 'features/auth/components/SSOButton/SSOButtonGoogleBase'
import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { getSnackbarSSOErrorMessage } from 'features/auth/helpers/getSSOErrorMessage'
import { useSignInMutation } from 'features/auth/queries/useSignInMutation'
import { FormattedLastLoginInfo, SignInResponseFailure } from 'features/auth/types'
import {
  StepperOrigin,
  UseNavigationType,
  UseRouteType,
} from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo } from 'ui/theme'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

export const LoginMethodsWithLastLoginInfo = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'LoginMethodsWithLastLoginInfo'>>()
  const enableAppleSSO = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APPLE_SSO)

  const onLogSignUpAnalytics = useCallback(() => {
    void analytics.logSignUpClicked({ from: 'loginMethods' })
  }, [])

  const [lastLoginInfo, setLastLoginInfo] = useState<FormattedLastLoginInfo | null>(null)

  useEffect(() => {
    const loadLastLoginInfo = async () => {
      const info = await getLastLoginInfo()
      setLastLoginInfo(info)
    }
    void loadLastLoginInfo()
  }, [])

  const onSSOSignInFailure = useCallback(
    (response: SignInResponseFailure) => {
      if (response.content?.code === 'SSO_EMAIL_NOT_FOUND') {
        return navigate('SignupForm', {
          accountCreationToken: response.content?.accountCreationToken,
          email: response.content?.email,
          from: StepperOrigin.LOGIN_METHODS,
          ssoProvider: response.provider,
        })
      }
      showErrorSnackBar(getSnackbarSSOErrorMessage({ response, context: 'login' }))
    },
    [navigate]
  )

  const { mutate: signInGoogle } = useSignInMutation({
    params,
    doNotNavigateOnSigninSuccess: false,
    onFailure: onSSOSignInFailure,
    analyticsType: 'SSO_login',
    analyticsMethod: 'fromLoginGoogle',
  })

  const { mutate: signInApple } = useSignInMutation({
    params,
    doNotNavigateOnSigninSuccess: false,
    onFailure: onSSOSignInFailure,
    analyticsType: 'SSO_login',
    analyticsMethod: 'fromLoginApple',
  })

  return (
    <PageWithHeader
      shouldLimitWidth
      shouldDisplayBackButton
      title="Connexion"
      scrollChildren={
        <ViewGap gap={6}>
          <Typo.Title3 {...getTextSemanticAttrs(2)}>Connecte-toi</Typo.Title3>

          <LastLoginInfoBanner lastLoginInfo={lastLoginInfo} />

          {lastLoginInfo?.provider.label === 'Google' ? (
            <SSOButtonGoogleBase type="login" onSuccess={signInGoogle} />
          ) : null}

          {lastLoginInfo?.provider.label === 'Apple' && enableAppleSSO ? (
            <SSOButtonAppleBase type="login" onSuccess={signInApple} />
          ) : null}

          {lastLoginInfo?.provider.label === 'E-mail' ? (
            <InternalTouchableLink
              as={Button}
              variant="secondary"
              color="neutral"
              icon={EmailFilled}
              wording="Continuer avec mon e-mail"
              navigateTo={{ screen: 'Login', params }}
            />
          ) : null}

          <InternalTouchableLink
            as={Button}
            variant="tertiary"
            color="neutral"
            icon={PlainArrowNext}
            wording="Autres moyens de connexion"
            navigateTo={{ screen: 'LoginMethods', params }}
          />
        </ViewGap>
      }
      fixedBottomChildren={<SignUpButton type="signup" onAdditionalPress={onLogSignUpAnalytics} />}
    />
  )
}

const SignUpButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``
