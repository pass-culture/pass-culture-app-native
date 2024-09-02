import React from 'react'

import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

import { EduConnectForm } from './EduConnectForm'

const mockOpenEduConnectTab = jest.fn()
jest.spyOn(useEduConnectLoginAPI, 'useEduConnectLogin').mockReturnValue({
  openEduConnectTab: mockOpenEduConnectTab,
  error: null,
})

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
