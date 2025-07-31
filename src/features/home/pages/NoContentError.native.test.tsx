import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NoContentError } from 'features/home/pages/NoContentError'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('NoContentError', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
    render(<NoContentError />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should redirect to Search tab when pressing the button', async () => {
    render(<NoContentError />)
    const searchButton = screen.getByText('Rechercher une offre')
    await user.press(searchButton)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: { screen: 'SearchLanding' },
    })
  })
})
