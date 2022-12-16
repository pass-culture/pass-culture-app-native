import React from 'react'

import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('react-query')

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetCity />)
    expect(renderAPI).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SetCity />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
