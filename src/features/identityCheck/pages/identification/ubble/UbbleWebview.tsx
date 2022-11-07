import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { REDIRECT_URL_UBBLE, useIdentificationUrl } from 'features/identityCheck/api/api'
import { parseUrlParams } from 'features/identityCheck/utils/parseUrlParams'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/firebase/analytics'
import { LoadingPage } from 'ui/components/LoadingPage'
import { Spacer } from 'ui/theme'

// To avoid [Error: Unable to open URL: about:srcdoc. Add about to LSApplicationQueriesSchemes in your Info.plist.]
const ORIGIN_WHITELIST = ['*']

export const UbbleWebview: React.FC = () => {
  const identificationUrl = useIdentificationUrl()
  const { navigate } = useNavigation<UseNavigationType>()

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
      navigate('IdentityCheckEnd')
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
