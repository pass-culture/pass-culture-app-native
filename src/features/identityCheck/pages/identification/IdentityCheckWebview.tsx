import { useRoute, useNavigation } from '@react-navigation/native'
import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { REDIRECT_URL_UBBLE } from 'features/identityCheck/api'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { Spacer } from 'ui/theme'

// To avoid [Error: Unable to open URL: about:srcdoc. Add about to LSApplicationQueriesSchemes in your Info.plist.]
const ORIGIN_WHITELIST = ['*']

export const IdentityCheckWebview: React.FC = () => {
  const { params } = useRoute<UseRouteType<'IdentityCheckWebview'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  function onNavigationStateChange({ url }: { url: string }) {
    if (url.includes(REDIRECT_URL_UBBLE)) navigate('IdentityCheckEnd')
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledWebview
        source={{ uri: params.identificationUrl }}
        onNavigationStateChange={onNavigationStateChange}
        originWhitelist={ORIGIN_WHITELIST}
        allowsInlineMediaPlayback
        testID="identity-check-webview"
      />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const StyledWebview = styled(WebView)({
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})
