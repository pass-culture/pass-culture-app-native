import React from 'react'

import { NotificationsSettings } from 'features/profile/pages/NotificationSettings/NotificationsSettings'
import { checkAccessibilityFor, render, waitFor } from 'tests/utils/web'

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

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
