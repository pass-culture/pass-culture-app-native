import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { render, screen, userEvent } from 'tests/utils'

import { UpdatePersonalDataConfirmation } from './UpdatePersonalDataConfirmation'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/AuthContext')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<UpdatePersonalDataConfirmation />', () => {
  it('should render correctly', async () => {
    render(<UpdatePersonalDataConfirmation />)

    await screen.findByText('C’est noté !')

    expect(screen).toMatchSnapshot()
  })

  it('should naviate and reset to home screen when clicking on "Terminer" button', async () => {
    render(<UpdatePersonalDataConfirmation />)

    await user.press(await screen.findByText('Terminer'))

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavigationConfig[0] }],
    })
  })
})
