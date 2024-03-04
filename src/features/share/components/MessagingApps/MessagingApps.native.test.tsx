import React from 'react'
import { Linking } from 'react-native'
import Share, { Social } from 'react-native-share'

import { MessagingApps } from 'features/share/components/MessagingApps/MessagingApps'
import { ShareContent } from 'libs/share/types'
import { fireEvent, render, screen } from 'tests/utils'

const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)

const defaultShareContent: ShareContent = {
  body: 'message',
  subject: 'title',
  url: 'url',
}

describe('<MessagingApps />', () => {
  it('should use share on other press', async () => {
    const mockShare = jest.fn()
    render(
      <MessagingApps
        shareContent={defaultShareContent}
        share={mockShare}
        messagingAppAnalytics={jest.fn()}
      />
    )
    const otherButton = await screen.findByText('Plus\nd’options')

    fireEvent.press(otherButton)

    expect(mockShare).toHaveBeenCalledTimes(1)
  })

  it('should share on Whatsapp', async () => {
    canOpenURLSpy.mockResolvedValueOnce(true)
    canOpenURLSpy.mockResolvedValueOnce(true)
    render(
      <MessagingApps
        shareContent={defaultShareContent}
        share={jest.fn()}
        messagingAppAnalytics={jest.fn()}
      />
    )

    const whatsappButton = await screen.findByText('Envoyer sur WhatsApp')

    fireEvent.press(whatsappButton)

    expect(mockShareSingle).toHaveBeenCalledWith({
      message: 'message\u00a0:\n',
      social: Social.Whatsapp,
      type: 'text',
      url: 'url&utm_source=WhatsApp',
    })
  })

  it('should log analytics on other press', async () => {
    const mockAnalytics = jest.fn()
    render(
      <MessagingApps
        shareContent={defaultShareContent}
        share={jest.fn()}
        messagingAppAnalytics={mockAnalytics}
      />
    )
    const otherButton = await screen.findByText('Plus\nd’options')

    fireEvent.press(otherButton)

    expect(mockAnalytics).toHaveBeenCalledTimes(1)
  })
})
