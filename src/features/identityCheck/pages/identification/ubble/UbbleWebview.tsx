import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { REDIRECT_URL_UBBLE } from 'features/identityCheck/constants'
import { parseUrlParams } from 'features/identityCheck/pages/helpers/parseUrlParams'
import { useIdentificationUrlMutation } from 'features/identityCheck/queries/useIdentificationUrlMutation'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { analytics } from 'libs/analytics/provider'
import { LoadingPage } from 'ui/pages/LoadingPage'
import { Spacer } from 'ui/theme'

// To avoid [Error: Unable to open URL: about:srcdoc. Add about to LSApplicationQueriesSchemes in your Info.plist.]
const ORIGIN_WHITELIST = ['*']

export const UbbleWebview: React.FC = () => {
  const identificationUrl = useIdentificationUrlMutation()
  const { navigate } = useNavigation<UseNavigationType>()

  function onNavigationStateChange({ url }: { url: string }) {
    const parsedUrlParams = parseUrlParams(url)
    // See https://ubbleai.github.io/developer-documentation/#step-3-manage-user-return
    const status = parsedUrlParams['status']
    const event = parsedUrlParams['event']
    if (event === 'identity_verification_capture_aborted') {
      void analytics.logIdentityCheckAbort({
        method: IdentityCheckMethod.ubble,
        reason: event,
        errorType: parsedUrlParams['response_code'] ?? null,
      })
      navigate(...getSubscriptionHookConfig('Stepper'))
    } else if (status === 'aborted') {
      void analytics.logIdentityCheckAbort({
        method: IdentityCheckMethod.ubble,
        reason: parsedUrlParams['return_reason'] ?? null,
        errorType: parsedUrlParams['error_type'] ?? null,
      })
      navigateToHome()
    } else if (url.includes(REDIRECT_URL_UBBLE)) {
      void analytics.logIdentityCheckSuccess({ method: IdentityCheckMethod.ubble })
      navigate(...getSubscriptionHookConfig('IdentityCheckEnd'))
    }
  }

  if (!identificationUrl) {
    return <LoadingPage />
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledWebview
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        source={{ uri: identificationUrl }}
        onNavigationStateChange={onNavigationStateChange}
        originWhitelist={ORIGIN_WHITELIST}
        testID="identity-check-webview"
      />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const StyledWebview = styled(WebView)({
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})
