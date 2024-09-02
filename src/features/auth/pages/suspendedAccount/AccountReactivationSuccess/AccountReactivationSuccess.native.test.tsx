import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { fireEvent, render, screen } from 'tests/utils'

import { AccountReactivationSuccess } from './AccountReactivationSuccess'

jest.mock('features/navigation/helpers/navigateToHome')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<AccountReactivationSuccess />', () => {
  it('should match snapshot', () => {
    render(<AccountReactivationSuccess />)

    expect(screen).toMatchSnapshot()
  })

  it('should go to home page when clicking on go to home button', () => {
    render(<AccountReactivationSuccess />)

    const homeButton = screen.getByText('Découvrir le catalogue')
    fireEvent.press(homeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
