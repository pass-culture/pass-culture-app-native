import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { withCulturalSurveyProvider } from 'features/firstLogin/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { Spacer } from 'ui/theme'

export const CulturalSurvey: React.FC = withCulturalSurveyProvider(function (props) {
  const { userId, userPk, url } = props.culturalSurveyConfig
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: settings } = useSettingsContext()

  function onNavigationStateChange(webviewUrl: string, idUser: string, pkUser: string) {
    const isTypeformShowedInWebview = webviewUrl.includes('typeform.com')
    if (!isTypeformShowedInWebview) {
      props.onCulturalSurveyExit(idUser, pkUser)
    }
  }

  useEffect(() => {
    // make sure we redirect to the right cultural survey if feature flag is activated
    if (settings?.enableNativeCulturalSurvey) {
      navigate('CulturalSurveyIntro')
    }
  })

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
