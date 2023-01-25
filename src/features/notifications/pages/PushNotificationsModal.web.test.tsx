import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { PushNotificationsModal } from './PushNotificationsModal'

const onDismiss = jest.fn()
const onRequestPermission = jest.fn()

describe('<PushNotificationsModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <PushNotificationsModal
          onDismiss={onDismiss}
          onRequestPermission={onRequestPermission}
          visible
        />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
