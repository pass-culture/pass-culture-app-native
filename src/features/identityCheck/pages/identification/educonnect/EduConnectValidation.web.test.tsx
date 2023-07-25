import React from 'react'

import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { EduConnectValidation } from './EduConnectValidation'

jest.mock('features/identityCheck/context/SubscriptionContextProvider')
jest.mock('features/auth/context/AuthContext')

describe('<EduConnectValidation />', () => {
  it('should render EduConnectValidation component correctly', () => {
    const renderAPI = render(<EduConnectValidation />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    render(<EduConnectValidation />)
    expect(screen.getByText('John')).toBeTruthy()
    expect(screen.getByText('Doe')).toBeTruthy()
    expect(screen.getByText('28/01/1993')).toBeTruthy()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<EduConnectValidation />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
