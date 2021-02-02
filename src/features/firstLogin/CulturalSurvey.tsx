import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useRef } from 'react'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

import { useCurrentRoute } from 'features/navigation/helpers'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { Background } from 'ui/svg/Background'
import { Spacer } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'CulturalSurvey'>

const WEBVIEW_HTML = `<html>
                        <head>
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <script src="https://embed.typeform.com/embed.js"></script>
                        </head>
                        <div id="typeform-embed" />
                      </html>`
const WEBVIEW_SOURCE = { html: WEBVIEW_HTML }

export const CulturalSurvey: React.FC<Props> = function () {
  const currentRoute = useCurrentRoute()
  const navigation = useNavigation<UseNavigationType>()
  const webviewRef = useRef<WebView>(null)

  function onLoad() {
    if (webviewRef.current) {
      const encodedUUIDv1 = encodeURIComponent(uuidv1())
      const url = `${env.CULTURAL_SURVEY_TYPEFORM_URL}?userId=${encodedUUIDv1}`
      // See options object at https://developer.typeform.com/embed/modes/#popup-mode
      const options = {
        hideHeaders: false,
        hideFooter: false,
        opacity: 100,
      }
      const stringifedOptions = JSON.stringify(JSON.stringify(options))
      const embedCode = `{
          const onSubmit = () => window.ReactNativeWebView.postMessage("onSubmit")
          const onClose = () => window.ReactNativeWebView.postMessage("onClose")
          const options = Object.assign({}, JSON.parse(${stringifedOptions}), {onSubmit,onClose})
          const ref = typeformEmbed.makePopup('${url}', options)
          ref.open()
        }`
      webviewRef.current.injectJavaScript(embedCode)
    }
  }

  function onMessage(event: WebViewMessageEvent) {
    const message = event.nativeEvent.data
    if (message === 'onClose') {
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
