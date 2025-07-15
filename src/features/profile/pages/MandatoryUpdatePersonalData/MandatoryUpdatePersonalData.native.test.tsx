import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'

import { MandatoryUpdatePersonalData } from './MandatoryUpdatePersonalData'

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

describe('<MandatoryUpdatePersonalData />', () => {
  it('should render correctly', async () => {
    render(<MandatoryUpdatePersonalData />)

    await screen.findByText('Une petite mise à jour de tes informations personnelles ?')

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to ProfileInformationValidationUpdate screen when "Commencer" button is clicked', async () => {
    render(<MandatoryUpdatePersonalData />)

    await user.press(await screen.findByText('Commencer'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      screen: 'ProfileInformationValidationUpdate',
      params: undefined,
    })
  })
})
