import React from 'react'

import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('react-query')

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))

jest.mock('features/identityCheck/context/SubscriptionContextProvider')

describe('<SetAddress/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetAddress />)
    expect(renderAPI).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<SetAddress />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
