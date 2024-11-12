import React from 'react'

import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { EduConnectValidation } from './EduConnectValidation'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('features/auth/context/AuthContext')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<EduConnectValidation />', () => {
  it('should render EduConnectValidation component correctly', () => {
    const { container } = render(<EduConnectValidation />)

    expect(container).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    render(<EduConnectValidation />)

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
    expect(screen.getByText('28/01/1993')).toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<EduConnectValidation />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
