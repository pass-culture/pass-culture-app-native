import React from 'react'

import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { ShareContent } from 'libs/share/types'
import { fireEvent, render, screen } from 'tests/utils/web'

const defaultShareContent: ShareContent = {
  body: 'message',
  subject: 'title',
  url: 'url',
}

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<MessagingApps />', () => {
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
