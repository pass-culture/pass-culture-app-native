import React from 'react'
import WebView from 'react-native-webview'
import styled from 'styled-components/native'

import { env } from 'libs/environment'
import { getSpacing } from 'ui/theme'

type ReCaptchaProps = {
  onReceiveToken: (captchaToken: string) => void
}

export const ReCaptchaV2: React.FC<ReCaptchaProps> = ({ onReceiveToken }) => {
  return (
    <StyledWebview
      javaScriptEnabled
      originWhitelist={['*']}
      automaticallyAdjustContentInsets
      mixedContentMode={'always'}
      source={{
        html: renderReCaptchaWidget(),
        baseUrl: `https://www.google.com/recaptcha/api.js?render=${env.RECAPTCHA_SITE_KEY}`,
      }}
      onMessage={(e: any) => {
        onReceiveToken(e.nativeEvent.data)
      }}
    />
  )
}

const StyledWebview = styled(WebView)({
  alignItems: 'center',
  width: getSpacing(80),
  height: getSpacing(22), // FIXME - adapt webview size if recaptcha challenge appears
  opacity: 0.99,
})

function renderReCaptchaWidget() {
  return `
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0">
        <script src="https://www.google.com/recaptcha/api.js?explicit&hl=fr" async defer></script>
        <script type="text/javascript">
          var onDataCallback = function(response) {
            window.ReactNativeWebView.postMessage(response)
          }
        </script>
        <style>
          // FIXME add overflow: hidden when recaptcha challenge is correctly displayed
          body { display: flex; justify-content: center;}
        </style>
      </head>
      <body>
          <div class="captcha">
            <div
              class="g-recaptcha"
              data-sitekey="${env.RECAPTCHA_SITE_KEY}"
              data-callback="onDataCallback">
            </div>
          </div>
      </body>
    </html>
  `
}
