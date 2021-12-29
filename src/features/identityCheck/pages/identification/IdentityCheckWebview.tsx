import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { REDIRECT_URL_UBBLE, useIdentificationUrl } from 'features/identityCheck/api'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { parseUrlParams } from 'features/identityCheck/utils/parseUrlParams'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { LoadingPage } from 'ui/components/LoadingPage'
import { Spacer } from 'ui/theme'

// To avoid [Error: Unable to open URL: about:srcdoc. Add about to LSApplicationQueriesSchemes in your Info.plist.]
const ORIGIN_WHITELIST = ['*']

export const IdentityCheckWebview: React.FC = () => {
  const identificationUrl = useIdentificationUrl()
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  function onNavigationStateChange({ url }: { url: string }) {
    const parsedUrlParams = parseUrlParams(url)
    // See https://ubbleai.github.io/developer-documentation/#step-3-manage-user-return
    const status = parsedUrlParams['status']
    if (status === 'aborted') {
      analytics.logIdentityCheckAbort({
        method: IdentityCheckMethod.ubble,
        reason: parsedUrlParams['return_reason'] || null,
        errorType: parsedUrlParams['error_type'] || null,
      })
      navigateToHome()
    } else if (url.includes(REDIRECT_URL_UBBLE)) {
      analytics.logIdentityCheckSuccess({ method: IdentityCheckMethod.ubble })
      navigateToNextScreen()
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
