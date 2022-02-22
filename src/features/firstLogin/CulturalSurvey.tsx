import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { withCulturalSurveyProvider } from 'features/firstLogin/helpers'
import { Spacer } from 'ui/theme'

export const CulturalSurvey: React.FC = withCulturalSurveyProvider(function (props) {
  const { userId, userPk, url } = props.culturalSurveyConfig

  function onNavigationStateChange(webviewUrl: string, idUser: string, pkUser: string) {
    const isTypeformShowedInWebview = webviewUrl.includes('typeform.com')
    if (!isTypeformShowedInWebview) {
      props.onCulturalSurveyExit(idUser, pkUser)
    }
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <StyledWebview
        onNavigationStateChange={(event) => {
          onNavigationStateChange(event.url, userId, userPk)
        }}
        source={{ uri: url }}
        testID="cultural-survey-webview"
      />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
})

const StyledWebview = styled(WebView)({
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})
