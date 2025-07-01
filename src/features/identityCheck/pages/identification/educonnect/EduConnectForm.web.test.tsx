import React from 'react'

import * as useEduConnectLoginAPI from 'features/identityCheck/queries/useEduConnectLoginMutation'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { EduConnectForm } from './EduConnectForm'

const mockOpenEduConnectTab = jest.fn()
jest.spyOn(useEduConnectLoginAPI, 'useEduConnectLoginMutation').mockReturnValue({
  openEduConnectTab: mockOpenEduConnectTab,
  error: null,
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<EduConnectForm />', () => {
  it('should render EduConnectForm', () => {
    const { container } = render(<EduConnectForm />)

    expect(container).toMatchSnapshot()
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
