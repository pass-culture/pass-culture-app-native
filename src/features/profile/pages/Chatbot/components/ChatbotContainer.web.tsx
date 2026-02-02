import React from 'react'
import styledWeb from 'styled-components'

import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Page } from 'ui/pages/Page'

import { chatbotWebviewHTML } from '../chatbotWebviewHTML'

export const ChatbotContainer = () => {
  const headerHeight = useGetHeaderHeight()

  return (
    <Page>
      <PageHeaderWithoutPlaceholder title="J’ai une question" />
      <Placeholder height={headerHeight} />
      <StyledContainer>
        <StyledIframe srcDoc={chatbotWebviewHTML} title="Chatbot" id="chatbot-iframe" />
      </StyledContainer>
    </Page>
  )
}

const Placeholder = styledWeb.div<{ height: number }>(({ height }) => ({
  height: `${height}px`,
  width: '100%',
}))

const StyledContainer = styledWeb.div({
  width: '100%',
  height: '100%',
})

const StyledIframe = styledWeb.iframe({
  border: 'none',
  width: '100%',
  height: '100%',
})
