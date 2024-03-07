import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act, screen } from 'tests/utils/web'

import { NotificationSettingsDeprecated } from './NotificationSettingsDeprecated'

jest.mock('features/auth/context/AuthContext')

useRoute.mockReturnValue({ key: 'ksdqldkmqdmqdq' })

describe('<NotificationSettings/>', () => {
  it('should only display switch to authorize emails', async () => {
    render(reactQueryProviderHOC(<NotificationSettingsDeprecated />))

    expect(await screen.findByText('Autoriser l’envoi d’e-mails')).toBeTruthy()
    expect(screen.queryByText('Autoriser les notifications marketing')).not.toBeOnTheScreen()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<NotificationSettingsDeprecated />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
