import React from 'react'

import { MessagingApps } from 'features/share/components/MessagingAppsNew/MessagingAppsNew'
import { ShareContent } from 'libs/share/types'
import { fireEvent, render, screen } from 'tests/utils/web'

const defaultShareContent: ShareContent = {
  body: 'message',
  subject: 'title',
  url: new URL('https://www.toto.com'),
}

describe('<MessagingAppsNew />', () => {
  it('should open share modal on other press', async () => {
    const mockShare = jest.fn()
    render(
      <MessagingApps
        shareContent={defaultShareContent}
        share={mockShare}
        messagingAppAnalytics={jest.fn()}
      />
    )
    const otherButton = await screen.findByText('Plus d’options')

    fireEvent.click(otherButton)

    expect(screen.getByText('Partager l’offre')).toBeInTheDocument()
  })
})
