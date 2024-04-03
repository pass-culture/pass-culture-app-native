import React from 'react'

import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

describe('<NotificationsSettingsModal />', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <NotificationsSettingsModal
          visible
          theme={SubscriptionTheme.CINEMA}
          dismissModal={jest.fn()}
          onPressSaveChanges={jest.fn()}
        />
      )
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
