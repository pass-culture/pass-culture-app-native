import React from 'react'

import { render, checkAccessibilityFor } from 'tests/utils/web'

import { FeedbackInApp } from './FeedbackInApp'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

describe('<FeedbackInApp/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<FeedbackInApp />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
