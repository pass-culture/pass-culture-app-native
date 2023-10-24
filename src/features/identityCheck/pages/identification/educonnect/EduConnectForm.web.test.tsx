import React from 'react'

import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { EduConnectForm } from './EduConnectForm'

const mockOpenEduConnectTab = jest.fn()
jest.spyOn(useEduConnectLoginAPI, 'useEduConnectLogin').mockReturnValue({
  openEduConnectTab: mockOpenEduConnectTab,
  error: null,
})

describe('<EduConnectForm />', () => {
  it('should render EduConnectForm', () => {
    const renderAPI = render(<EduConnectForm />)

    expect(renderAPI).toMatchSnapshot()
  })

  it('should open educonnect tab on press "Connexion avec ÉduConnect"', () => {
    render(<EduConnectForm />)
    const button = screen.getByText('Ouvrir un onglet ÉduConnect')

    fireEvent.click(button)

    // first call happens in useEffect, second one on press
    expect(mockOpenEduConnectTab).toHaveBeenCalledTimes(2)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<EduConnectForm />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
