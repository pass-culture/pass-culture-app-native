import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useRef } from 'react'
import { WebView, WebViewNavigation } from 'react-native-webview'
import styled from 'styled-components/native'

import { useCurrentRoute } from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { LoadingPage } from 'ui/components/LoadingPage'

type Props = StackScreenProps<RootStackParamList, 'IdCheck'>

export const IdCheck: React.FC<Props> = function (props) {
  const currentRoute = useCurrentRoute()
  const navigation = useNavigation<UseNavigationType>()
  const webviewRef = useRef<WebView>(null)

  const { email, licenceToken } = props.route.params
  const encodedEmail = encodeURIComponent(email)
  const uri = `${env.ID_CHECK_URL}/?email=${encodedEmail}&licence_token=${licenceToken}`

  function onNavigationStateChange(event: WebViewNavigation) {
    // For more info, see the buffer pages (i.e. to exit the webview) of the Id Check web app
    const isEligibilityProcessAbandonned = event.url.includes('/exit')
    const isEligibilityProcessFinished = event.url.includes('/end')
    if (isEligibilityProcessAbandonned) {
      navigation.navigate('Home', { shouldDisplayLoginModal: false })
    } else if (isEligibilityProcessFinished) {
      navigation.navigate('EligibilityConfirmed')
    }
  }

  if (currentRoute?.name !== 'IdCheck') return null
  return (
    <StyledWebview
      ref={webviewRef}
      testID="idcheck-webview"
      source={{ uri }}
      startInLoadingState={true}
      renderLoading={() => (
        <LoadingPageContainer>
          <LoadingPage />
        </LoadingPageContainer>
      )}
      onNavigationStateChange={onNavigationStateChange}
      onError={({ nativeEvent }) => {
        if (nativeEvent.url.startsWith('mailto:') && nativeEvent.canGoBack) {
          // Fallback for mailto links when ERR_UNKNOWN_URL_SCHEME error appears
          webviewRef.current?.goBack()
        }
      }}
    />
  )
}

const StyledWebview = styled(WebView)({
  height: '100%',
  width: '100%',
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})

const LoadingPageContainer = styled.View({
  height: '100%',
  width: '100%',
})
