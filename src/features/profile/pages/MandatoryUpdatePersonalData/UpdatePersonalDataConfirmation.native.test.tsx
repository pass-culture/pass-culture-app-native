import React from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
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

  it('should redirect to ProfileInformationValidationUpdate screen when "Commencer" button is clicked', async () => {
    render(<UpdatePersonalDataConfirmation />)

    await user.press(await screen.findByText('Terminer'))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
