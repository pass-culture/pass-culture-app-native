import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { IdentityCheckValidation } from './IdentityCheckValidation'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('features/identityCheck/useSubscriptionNavigation')
jest.mock('features/auth/context/AuthContext')

describe('<IdentityCheckValidation />', () => {
  it('should render IdentityCheckValidation component correctly', () => {
    const renderAPI = render(<IdentityCheckValidation />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    const { getByText } = render(<IdentityCheckValidation />)
    expect(getByText('John')).toBeTruthy()
    expect(getByText('Doe')).toBeTruthy()
    expect(getByText('28/01/1993')).toBeTruthy()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckValidation />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
