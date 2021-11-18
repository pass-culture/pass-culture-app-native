import { useRoute } from '@react-navigation/native'
import React from 'react'
import WebView from 'react-native-webview'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator'
import { Spacer } from 'ui/theme'

export const IdentityCheckWebview: React.FC = () => {
  const { params } = useRoute<UseRouteType<'IdentityCheckWebview'>>()

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledWebview source={{ uri: params.identificationUrl }} testID="identity-check-webview" />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const StyledWebview = styled(WebView)({
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})
