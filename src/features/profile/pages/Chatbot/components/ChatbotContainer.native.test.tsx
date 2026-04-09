import React from 'react'

import { ChatbotContainer } from 'features/profile/pages/Chatbot/components/ChatbotContainer'
import { render, screen } from 'tests/utils'

describe('ChatbotContainer', () => {
  it('should render webview correctly', async () => {
    render(<ChatbotContainer />)

    expect(screen).toMatchSnapshot()
  })
})
