import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { WebView, WebViewNavigation } from 'react-native-webview'
import styled from 'styled-components/native'

import { useCurrentRoute } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { LoadingPage } from 'ui/components/LoadingPage'

type Props = StackScreenProps<RootStackParamList, 'IdCheck'>

export const IdCheck: React.FC<Props> = function (props) {
  const currentRoute = useCurrentRoute()
  const navigation = useNavigation()

  const { email, licenceToken } = props.route.params
  const uri = `${env.ID_CHECK_URL}/?email=${email}&licence_token=${licenceToken}`

  function onNavigationStateChange(event: WebViewNavigation) {
    // For more info, see the termination route of the Id Check web app
    const shouldCloseWebView = event.url.includes('/end')
    if (shouldCloseWebView) {
      navigation.navigate('Home', { shouldDisplayLoginModal: false })
    }
  }

  if (currentRoute?.name === 'IdCheck') {
    return (
      <StyledWebview
        testID="idcheck-webview"
        source={{ uri }}
        startInLoadingState={true}
        renderLoading={() => (
          <LoadingPageContainer>
            <LoadingPage />
          </LoadingPageContainer>
        )}
        onNavigationStateChange={onNavigationStateChange}
      />
    )
  }
  return null
}

const StyledWebview = styled(WebView)({
  height: '100%',
  width: '100%',
})

const LoadingPageContainer = styled.View({
  height: '100%',
  width: '100%',
})
