import React from 'react'

import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { IdentityCheckEduConnectForm } from './IdentityCheckEduConnectForm'

const mockOpenEduConnectTab = jest.fn()
jest.spyOn(useEduConnectLoginAPI, 'useEduConnectLogin').mockReturnValue({
  openEduConnectTab: mockOpenEduConnectTab,
  loginUrl: 'https://login/?redirect=false',
  error: null,
})

describe('<IdentityCheckEduConnectForm />', () => {
  it('should render IdentityCheckEduConnectForm', () => {
    const renderAPI = render(<IdentityCheckEduConnectForm />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen and open educonnect tab on press "Connexion avec ÉduConnect"', () => {
    render(<IdentityCheckEduConnectForm />)
    const button = screen.getByText('Ouvrir un onglet ÉduConnect')

    fireEvent.click(button)

    expect(mockOpenEduConnectTab).toHaveBeenCalledTimes(1)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<IdentityCheckEduConnectForm />)
      const results = await checkAccessibilityFor(container)
      expect(results).toHaveNoViolations()
    })
  })
})
