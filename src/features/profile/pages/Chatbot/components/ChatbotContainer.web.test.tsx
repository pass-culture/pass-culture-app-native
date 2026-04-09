import React from 'react'

import { ChatbotContainer } from 'features/profile/pages/Chatbot/components/ChatbotContainer'
import { render, screen } from 'tests/utils/web'

describe('ChatbotContainer', () => {
  it('should render iframe correctly', async () => {
    render(<ChatbotContainer />)

    expect(screen).toMatchSnapshot()
  })
})
