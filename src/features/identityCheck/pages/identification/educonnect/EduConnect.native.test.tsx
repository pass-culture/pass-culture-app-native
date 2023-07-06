import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as useEduConnectLoginAPI from 'features/identityCheck/api/useEduConnectLogin'
import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { EduConnect } from 'features/identityCheck/pages/identification/educonnect/EduConnect'
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

describe('<EduConnect />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<EduConnect />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen on press "Connexion avec ÉduConnect"', () => {
    const { getByText } = render(<EduConnect />)
    const button = getByText('Connexion avec ÉduConnect')

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('EduConnectForm')
  })
  it("should trigger tracker when 'Connexion avec ÉduConnect' button is pressed", () => {
    const { getByText } = render(<EduConnect />)
    const button = getByText('Connexion avec ÉduConnect')

    fireEvent.press(button)

    expect(analytics.logConnectWithEduconnectClicked).toHaveBeenCalledTimes(1)
  })
})
