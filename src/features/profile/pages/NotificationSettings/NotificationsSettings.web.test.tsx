import React from 'react'

import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { checkAccessibilityFor, render, waitFor } from 'tests/utils/web'

describe('NotificationSettings', () => {
  it('should render correctly', () => {
    const { container } = render(<NotificationsSettings />)

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<NotificationsSettings />)

      const results = await checkAccessibilityFor(container)

      await waitFor(async () => {
        expect(results).toHaveNoViolations()
      })
    })
  })
})
