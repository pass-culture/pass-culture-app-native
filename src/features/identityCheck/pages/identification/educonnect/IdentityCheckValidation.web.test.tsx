import React from 'react'

import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { IdentityCheckValidation } from './IdentityCheckValidation'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('features/identityCheck/pages/helpers/useSubscriptionNavigation')
jest.mock('features/auth/context/AuthContext')

describe('<IdentityCheckValidation />', () => {
  it('should render IdentityCheckValidation component correctly', () => {
    const renderAPI = render(<IdentityCheckValidation />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    render(<IdentityCheckValidation />)
    expect(screen.getByText('John')).toBeTruthy()
    expect(screen.getByText('Doe')).toBeTruthy()
    expect(screen.getByText('28/01/1993')).toBeTruthy()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckValidation />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
