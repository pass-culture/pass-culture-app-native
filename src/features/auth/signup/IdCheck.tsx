import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
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

  const { email, licenceToken } = props.route.params
  const uri = `${env.ID_CHECK_URL}/?email=${email}&licence_token=${licenceToken}`

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
  opacity: 0.99, // DO NOT REMOVE : somehow, this opacity value prevents webview to crash on Android
})

const LoadingPageContainer = styled.View({
  height: '100%',
  width: '100%',
})
