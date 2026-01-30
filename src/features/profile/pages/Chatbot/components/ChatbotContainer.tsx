import React from 'react'
import { SafeAreaView } from 'react-native'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

export const ChatbotContainer = () => {
  const CHATBOT_URL = 'https://genii-script.tolk.ai/lightchat.js'

  return (
    <StyledSafeAreaView>
      <StyledWebView
        source={{ uri: CHATBOT_URL }}
        id="lightchat-bot"
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
      />
    </StyledSafeAreaView>
  )
}

const StyledSafeAreaView = styled(SafeAreaView)({
  flex: 1,
  backgroundColor: '#fff',
})

const StyledWebView = styled(WebView)({
  flex: 1,
})
