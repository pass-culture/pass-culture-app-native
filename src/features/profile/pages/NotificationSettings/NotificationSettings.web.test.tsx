import React from 'react'
import * as RNP from 'react-native-permissions'

import { useRoute } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act, screen } from 'tests/utils/web'

import { NotificationSettings } from './NotificationSettings'

jest.mock('features/auth/context/AuthContext')

useRoute.mockReturnValue({ key: 'ksdqldkmqdmqdq' })
jest.spyOn(RNP, 'checkNotifications').mockResolvedValue({
  status: 'granted',
  settings: {},
})

describe('<NotificationSettings/>', () => {
  it('should display first switch', async () => {
    render(reactQueryProviderHOC(<NotificationSettings />))

    expect(await screen.findByText('Autoriser l’envoi d’e-mails')).toBeTruthy()
    expect(screen.queryByText('Autoriser les notifications marketing')).not.toBeOnTheScreen()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<NotificationSettings />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
