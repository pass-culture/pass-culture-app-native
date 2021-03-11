import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { useCurrentRoute } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { MonitoringError } from 'libs/errorMonitoring'
import { LoadingPage } from 'ui/components/LoadingPage'
import { Background } from 'ui/svg/Background'
import { Spacer } from 'ui/theme'

type WebViewMessagePayload =
  | { message: 'onClose'; culturalSurveyId: string }
  | { message: 'onSubmit'; culturalSurveyId: string }

const WEBVIEW_HTML = `<html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <script src="https://embed.typeform.com/embed.js"></script>
                        </head>
                        <div id="typeform-embed" />
                      </html>`
const WEBVIEW_SOURCE = { html: WEBVIEW_HTML }

export const CulturalSurvey: React.FC = function () {
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const currentRoute = useCurrentRoute()
  const navigation = useNavigation<UseNavigationType>()
  const webviewRef = useRef<WebView>(null)
  const { data: user } = useUserProfileInfo()

  function onWebviewLoadEnd(userPk: UserProfileResponse['id']) {
    if (webviewRef.current) {
      const culturalSurveyId = encodeURIComponent(uuidv1()) // legacy issue : the query param userId is not the actual `user.id`
      const url = `${env.CULTURAL_SURVEY_TYPEFORM_URL}?userId=${culturalSurveyId}&userPk=${userPk}`
      const embedCode = `{
          function sendMessagePayload(payload) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          }
          // See options object at https://developer.typeform.com/embed/modes/#popup-mode
          const options = {
            hideHeaders: false,
            hideFooter: false,
            opacity: 100,
            onSubmit() { 
              sendMessagePayload({ message: "onSubmit", culturalSurveyId: "${culturalSurveyId}" });
            },
            onClose() { 
              sendMessagePayload({ message: "onClose", culturalSurveyId: "${culturalSurveyId}" });
            },
          };
          const ref = typeformEmbed.makePopup("${url}", options);
          ref.open();
        }`
      webviewRef.current.injectJavaScript(embedCode)
    }
  }

  async function onMessage(event: WebViewMessageEvent) {
    try {
      const payload: WebViewMessagePayload = JSON.parse(event.nativeEvent.data)
      const onClose = payload.message === 'onClose'
      const onSubmit = payload.message === 'onSubmit'
      if (onClose || onSubmit) {
        try {
          if (onClose && !hasSubmitted) {
            await api.postnativev1meculturalSurvey({
              culturalSurveyId: null,
              needsToFillCulturalSurvey: false,
            })
          }
          if (onClose) {
            navigation.navigate('Home', { shouldDisplayLoginModal: false })
          }
          if (onSubmit) {
            await api.postnativev1meculturalSurvey({
              culturalSurveyId: payload.culturalSurveyId,
              needsToFillCulturalSurvey: false,
            })
            setHasSubmitted(true)
          }
        } catch (error) {
          throw new MonitoringError(
            `The user profile could not be updated : typeform with culturalSurveyId ${payload.culturalSurveyId} 
            following '${payload.message}' action. Cause : ` + error,
            'UserProfileUpdateDuringCulturalSurvey'
          )
        }
      }
    } catch (error) {
      navigation.navigate('Home', { shouldDisplayLoginModal: false })
    }
  }

  function onNavigationStateChange(event: WebViewNavigation) {
    const isWebViewRedirectedtoWebapp = event.url.includes('app.passculture')
    if (isWebViewRedirectedtoWebapp) {
      navigation.navigate('Home', { shouldDisplayLoginModal: false })
    }
  }

  if (currentRoute?.name !== 'CulturalSurvey') {
    return null
  }
  if (!user) {
    return <LoadingPage />
  }
  return (
    <React.Fragment>
      <Background />
      <Spacer.TopScreen />
      <StyledWebview
        onLoadEnd={() => onWebviewLoadEnd(user.id)}
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
        ref={webviewRef}
        source={WEBVIEW_SOURCE}
        testID="cultural-survey-webview"
      />
      <Spacer.BottomScreen />
    </React.Fragment>
  )
}

const StyledWebview = styled(WebView)({
  opacity: 0.99, // DO NOT REMOVE : this opacity value prevents webview to crash on Android. See https://github.com/react-native-webview/react-native-webview/issues/429
})
