import React from 'react'
import { WebView } from 'react-native-webview'
import styled from 'styled-components/native'

import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

import { chatbotWebviewHTML } from '../chatbotWebviewHTML'

export const ChatbotContainer: React.FC = () => {
  const headerHeight = useGetHeaderHeight()
  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="J’ai une question" />
      <Placeholder height={headerHeight} />
      <WebView
        source={{
          html: chatbotWebviewHTML,
          baseUrl: 'https://genii-script.tolk.ai',
        }}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        testID="chatbot-webview"
      />
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
