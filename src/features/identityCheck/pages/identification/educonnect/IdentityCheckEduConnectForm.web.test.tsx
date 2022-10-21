import React from 'react'

import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { fireEvent, render } from 'tests/utils/web'

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
    const { getByText } = render(<IdentityCheckEduConnectForm />)
    const button = getByText('Ouvrir un onglet ÉduConnect')

    fireEvent.click(button)

    expect(mockOpenEduConnectTab).toHaveBeenCalled()
  })
})
