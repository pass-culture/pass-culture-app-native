import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NoContentError } from 'features/home/pages/NoContentError'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('NoContentError', () => {
  it('should render correctly', () => {
    render(<NoContentError />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should redirect to Search tab when pressing the button', () => {
    render(<NoContentError />)
    const searchButton = screen.getByText('Rechercher une offre')
    fireEvent.press(searchButton)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'SearchStackNavigator',
      params: { screen: 'SearchLanding' },
    })
  })
})
