import { render } from '@testing-library/react-native'
import React from 'react'
import { Platform } from 'react-native'

import { NotificationSettings } from './NotificationSettings'

function renderNotificationSettings() {
  return render(<NotificationSettings />)
}

describe('NotificationSettings', () => {
  it('should display the both switches on ios', () => {
    Platform.OS = 'ios'
    const { getByText } = renderNotificationSettings()
    getByText('Autoriser l’envoi d’e-mails')
    getByText('Autoriser les notifications marketing')
  })
  it('should only display the email switch on android', () => {
    Platform.OS = 'android'
    const { getByText } = renderNotificationSettings()
    getByText('Autoriser l’envoi d’e-mails')
  })
})
