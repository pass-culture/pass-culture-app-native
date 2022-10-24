import React from 'react'

import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckEduConnect } from 'features/identityCheck/pages/identification/educonnect/IdentityCheckEduConnect'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

jest.spyOn(useEduConnectLoginAPI, 'useEduConnectLogin').mockReturnValue({
  openEduConnectTab: jest.fn(),
  loginUrl: 'https://login/?redirect=false',
  error: null,
})

describe('<IdentityCheckEduConnect />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckEduConnect />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen on press "Connexion avec ÉduConnect"', () => {
    const { getByText } = render(<IdentityCheckEduConnect />)
    const button = getByText('Connexion avec ÉduConnect')

    fireEvent.press(button)

    expect(mockNavigateToNextScreen).toHaveBeenCalled()
  })
})
