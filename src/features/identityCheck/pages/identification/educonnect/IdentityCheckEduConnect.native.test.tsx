import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckEduConnect } from 'features/identityCheck/pages/identification/educonnect/IdentityCheckEduConnect'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
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

    expect(navigate).toHaveBeenCalledWith('IdentityCheckEduConnectForm')
  })
  it("should trigger tracker when 'Connexion avec ÉduConnect' button is pressed", () => {
    const { getByText } = render(<IdentityCheckEduConnect />)
    const button = getByText('Connexion avec ÉduConnect')

    fireEvent.press(button)

    expect(analytics.logConnectWithEduconnectClicked).toHaveBeenCalledTimes(1)
  })
})
