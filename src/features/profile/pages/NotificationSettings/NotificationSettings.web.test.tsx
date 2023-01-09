import React from 'react'

import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { NotificationSettings } from './NotificationSettings'

jest.mock('react-query')

describe('<NotificationSettings/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<NotificationSettings />)

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
