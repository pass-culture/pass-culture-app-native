import { useNavigation } from '@react-navigation/native'
import React, { lazy, Suspense } from 'react'
import styled from 'styled-components/native'

const WebView = lazy(() =>
  import('react-native-webview').then((module) => ({ default: module.WebView }))
)

import { IdentityCheckMethod } from 'api/gen'
import { REDIRECT_URL_UBBLE } from 'features/identityCheck/constants'
import { parseUrlParams } from 'features/identityCheck/pages/helpers/parseUrlParams'
import { useIdentificationUrlMutation } from 'features/identityCheck/queries/useIdentificationUrlMutation'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
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
    if (status === 'aborted') {
      analytics.logIdentityCheckAbort({
        method: IdentityCheckMethod.ubble,
        reason: parsedUrlParams['return_reason'] ?? null,
        errorType: parsedUrlParams['error_type'] ?? null,
      })
      navigateToHome()
    } else if (url.includes(REDIRECT_URL_UBBLE)) {
      analytics.logIdentityCheckSuccess({ method: IdentityCheckMethod.ubble })
      navigate(...getSubscriptionHookConfig('IdentityCheckEnd'))
    }
  }

  if (!identificationUrl) {
    return <LoadingPage />
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Suspense fallback={<LoadingPage />}>
        <StyledWebview
          allowsInlineMediaPlayback={false}
          mediaPlaybackRequiresUserAction
          source={{ uri: identificationUrl }}
          onNavigationStateChange={onNavigationStateChange}
          originWhitelist={ORIGIN_WHITELIST}
          testID="identity-check-webview"
        />
      </Suspense>
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const StyledWebview = styled(WebView)({
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})
