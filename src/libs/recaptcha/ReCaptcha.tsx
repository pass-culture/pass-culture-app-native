import React, { useState, useRef } from 'react'
import { Modal } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'

import { env } from 'libs/environment'

import { reCaptchaWebviewHTML } from './webviewHTML'

const ORIGIN_WHITELIST = ['*']

const WEBVIEW_SOURCE = {
  html: reCaptchaWebviewHTML,
  baseUrl: env.WEBAPP_URL,
}

type MessagePayload =
  | { message: 'close' }
  | { message: 'error'; error: string }
  | { message: 'expire' }
  | { message: 'load' }
  | { message: 'success'; token: string }

type Props = {
  onClose: () => void
  onError: (error: string) => void
  onExpire: () => void
  onLoad?: () => void
  onSuccess: (token: string) => void
  isVisible: boolean
}

export function ReCaptcha(props: Props) {
  const webViewRef = useRef<WebView>(null)
  const [isLoading, setIsLoading] = useState(true)

  function onLoadStart() {
    setIsLoading(true)
  }

  function handleLoad() {
    props.onLoad && props.onLoad()
    setIsLoading(false)
  }

  function handleMessage(event: WebViewMessageEvent) {
    try {
      const payload: MessagePayload = JSON.parse(event.nativeEvent.data)
      if (payload.message === 'load') handleLoad()
      if (payload.message === 'close') props.onClose()
      if (payload.message === 'expire') props.onExpire()
      if (payload.message === 'error') props.onError(payload.error)
      if (payload.message === 'success') props.onSuccess(payload.token)
    } catch (error) {
      console.warn(error)
    }
  }

  function handleNavigationStateChange() {
    // prevent navigation on Android
    if (!isLoading) {
      webViewRef.current?.stopLoading()
    }
  }

  function handleShouldStartLoadWithRequest(event: ShouldStartLoadRequest) {
    // prevent navigation on iOS
    return event.navigationType === 'other'
  }

  return (
    <Modal
      onRequestClose={props.onClose}
      testID="recaptcha-webview-modal"
      transparent
      visible={props.isVisible}>
      <StyledWebview
        allowsBackForwardNavigationGestures={false}
        bounces={false}
        onError={(event) => {
          const errorMessage = 'WebView error : ' + event.nativeEvent.description
          props.onError(errorMessage)
        }}
        onLoadStart={onLoadStart}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        originWhitelist={ORIGIN_WHITELIST}
        ref={webViewRef}
        source={WEBVIEW_SOURCE}
        testID="recaptcha-webview"
      />
    </Modal>
  )
}

const StyledWebview = styled(WebView)({
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0)',
})
