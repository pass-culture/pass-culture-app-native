import { URL } from 'url'

import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { REDIRECT_URL_UBBLE, useIdentificationUrl } from 'features/identityCheck/api'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
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
    const parsedUrl = new URL(url)
    // See https://ubbleai.github.io/developer-documentation/#step-3-manage-user-return
    const status = parsedUrl.searchParams.get('status')
    if (status === 'aborted') {
      analytics.logIdentityCheckAbort({
        method: IdentityCheckMethod.Ubble,
        reason: parsedUrl.searchParams.get('return_reason') || null,
        errorType: parsedUrl.searchParams.get('error_type') || null,
      })
      navigateToHome()
    } else if (url.includes(REDIRECT_URL_UBBLE)) {
      analytics.logIdentityCheckSuccess({ method: IdentityCheckMethod.Ubble })
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
