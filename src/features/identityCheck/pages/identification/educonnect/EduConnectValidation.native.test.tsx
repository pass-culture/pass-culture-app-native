import React from 'react'

import { CommonActions, dispatch, useRoute } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

import { EduConnectValidation } from './EduConnectValidation'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({
    dispatch: mockDispatch,
    identification: {
      done: false,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1993-01-28',
      method: null,
    },
  }),
}))

describe('<EduConnectValidation />', () => {
  beforeEach(() =>
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  )

  it('should redirect to Stepper when logged in with EduConnect', async () => {
    render(<EduConnectValidation />)
    const validateButton = screen.getByText('Valider mes informations')
    fireEvent.press(validateButton)

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(CommonActions.reset).toHaveBeenCalledWith({
        index: 1,
        routes: [{ name: 'TabNavigator' }, { name: 'Stepper' }],
      })
    })
  })

  it('should render EduConnectValidation component correctly', () => {
    const renderAPI = render(<EduConnectValidation />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    render(<EduConnectValidation />)
    expect(screen.getByText('John')).toBeOnTheScreen()
    expect(screen.getByText('Doe')).toBeOnTheScreen()
    expect(screen.getByText('28/01/1993')).toBeOnTheScreen()
  })
  it("should trigger tracker when the 'Valider mes informations' button is pressed", () => {
    render(<EduConnectValidation />)

    const button = screen.getByText('Valider mes informations')

    fireEvent.press(button)

    expect(analytics.logCheckEduconnectDataClicked).toHaveBeenCalledTimes(1)
  })
})
