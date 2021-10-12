import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { useCulturalSurveyConfig, useOnCulturalSurveyExit } from 'features/firstLogin/helpers'
import { useCurrentRoute } from 'features/navigation/helpers'
import { LoadingPage } from 'ui/components/LoadingPage'
import { Spacer } from 'ui/theme'

export const CulturalSurvey: React.FC = function () {
  const currentRoute = useCurrentRoute()
  const culturalSurveyConfig = useCulturalSurveyConfig()
  const onCulturalSurveyExit = useOnCulturalSurveyExit()

  function onNavigationStateChange(webviewUrl: string, userId: string, userPk: string) {
    const isTypeformShowedInWebview = webviewUrl.includes('typeform.com')
    if (!isTypeformShowedInWebview) {
      onCulturalSurveyExit(userId, userPk)
    }
  }

  if (currentRoute?.name !== 'CulturalSurvey') {
    return null
  }
  if (!culturalSurveyConfig) {
    return <LoadingPage />
  }
  const { url, userId, userPk } = culturalSurveyConfig
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
}

const StyledWebview = styled(WebView)({
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})
