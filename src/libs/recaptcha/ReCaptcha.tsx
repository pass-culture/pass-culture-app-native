import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes'
import styled from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

import { WEBAPP_V2_URL } from 'libs/environment'

import { reCaptchaWebviewHTML } from './webviewHTML'

const ORIGIN_WHITELIST = ['*']

type MessagePayload =
  | { message: 'close' }
  | { message: 'debug'; log: string }
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

export const ReCaptcha: React.FC<Props> = (props) => {
  const webViewRef = useRef<WebView>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [keyToReCreateWebViewFromScratch, setKeyToReCreateWebViewFromScratch] = useState<
    string | null
  >(null)

  const webviewSource = {
    html: reCaptchaWebviewHTML,
    baseUrl: WEBAPP_V2_URL,
  }

  useEffect(() => {
    props.isVisible && setKeyToReCreateWebViewFromScratch(uuidv1())
  }, [props.isVisible])

  function onLoadStart() {
    setIsLoading(true)
  }

  function handleLoad() {
    props.onLoad && props.onLoad()
    setIsLoading(false)
  }

  function handleClose() {
    props.onClose()
    setKeyToReCreateWebViewFromScratch(null)
  }

  function handleMessage(event: WebViewMessageEvent) {
    try {
      const payload: MessagePayload = JSON.parse(event.nativeEvent.data)
      if (payload.message === 'load') handleLoad()
      if (payload.message === 'close') props.onClose()
      if (payload.message === 'expire') props.onExpire()
      if (payload.message === 'error') props.onError(payload.error)
      if (payload.message === 'success') props.onSuccess(payload.token)
      // eslint-disable-next-line no-console
      if (payload.message === 'debug') console.debug(payload.log)
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
      onRequestClose={handleClose}
      testID="recaptcha-webview-modal"
      transparent
      visible={props.isVisible}>
      {props.isVisible && keyToReCreateWebViewFromScratch ? (
        <StyledWebview
          allowsBackForwardNavigationGestures={false}
          bounces={false}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          incognito={true}
          key={keyToReCreateWebViewFromScratch}
          onError={(event) => {
            const errorMessage = 'WebView error\u00a0: ' + event.nativeEvent.description
            props.onError(errorMessage)
          }}
          onLoadStart={onLoadStart}
          onMessage={handleMessage}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          originWhitelist={ORIGIN_WHITELIST}
          ref={webViewRef}
          source={webviewSource}
          testID="recaptcha-webview"
        />
      ) : null}
    </Modal>
  )
}

const StyledWebview = styled(WebView)({
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0)',
})
