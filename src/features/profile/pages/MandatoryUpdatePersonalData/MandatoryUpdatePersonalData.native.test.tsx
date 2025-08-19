import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, screen, userEvent } from 'tests/utils'

import { MandatoryUpdatePersonalData } from './MandatoryUpdatePersonalData'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

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

    await screen.findByText('Mets à jour ton profil')

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

  it('should open data privacy chart when pressing link', async () => {
    render(<MandatoryUpdatePersonalData />)

    const externalLink = screen.getByText('Charte des données personnelles')

    await user.press(externalLink)

    expect(openUrl).toHaveBeenCalledWith('https://passculture.privacy', undefined, true)
  })
})
