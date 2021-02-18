import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

import { api } from 'api/api'
import { useCurrentRoute } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { MonitoringError } from 'libs/errorMonitoring'
import { Background } from 'ui/svg/Background'
import { Spacer } from 'ui/theme'

type WebViewMessagePayload =
  | { message: 'onClose'; userId: string }
  | { message: 'onSubmit'; userId: string }

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

  function onLoad() {
    if (webviewRef.current) {
      const userId = encodeURIComponent(uuidv1())
      const url = `${env.CULTURAL_SURVEY_TYPEFORM_URL}?userId=${userId}`
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
              sendMessagePayload({ message: "onSubmit", userId: "${userId}" });
            },
            onClose() { 
              sendMessagePayload({ message: "onClose", userId: "${userId}" });
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
              culturalSurveyId: payload.userId,
              needsToFillCulturalSurvey: false,
            })
            setHasSubmitted(true)
          }
        } catch (error) {
          throw new MonitoringError(
            `The user profile could not be updated : typeform with userId ${payload.userId} 
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

  if (currentRoute?.name !== 'CulturalSurvey') return null
  return (
    <React.Fragment>
      <Background />
      <Spacer.TopScreen />
      <StyledWebview
        onLoadEnd={onLoad}
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
