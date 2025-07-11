import React from 'react'

import { dispatch, useRoute } from '__mocks__/@react-navigation/native'
import { EduconnectValidationPageButtonName } from 'features/identityCheck/pages/identification/educonnect/EduconnectValidationPage'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<EduConnectValidation />', () => {
  beforeEach(() =>
    useRoute.mockImplementation(() => ({
      params: {},
    }))
  )

  it('should redirect to Stepper when logged in with EduConnect', async () => {
    render(<EduConnectValidation />)
    const validateButton = screen.getByText(EduconnectValidationPageButtonName)
    await user.press(validateButton)

    expect(dispatch).toHaveBeenCalledWith({
      payload: {
        index: 1,
        routes: [
          { name: 'TabNavigator' },
          {
            name: 'SubscriptionStackNavigator',
            state: {
              routes: [
                {
                  name: 'Stepper',
                },
              ],
            },
          },
        ],
      },
      type: 'RESET',
    })
  })

  it('should render EduConnectValidation component correctly', () => {
    render(<EduConnectValidation />)

    expect(screen).toMatchSnapshot()
  })

  it('should display user infos with props given', () => {
    render(<EduConnectValidation />)

    expect(screen.getByText('John')).toBeOnTheScreen()
    expect(screen.getByText('Doe')).toBeOnTheScreen()
    expect(screen.getByText('28/01/1993')).toBeOnTheScreen()
  })

  it(`should trigger tracker when the "${EduconnectValidationPageButtonName}" button is pressed`, async () => {
    render(<EduConnectValidation />)

    await user.press(screen.getByText(EduconnectValidationPageButtonName))

    expect(analytics.logCheckEduconnectDataClicked).toHaveBeenCalledTimes(1)
  })
})
