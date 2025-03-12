import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { render, screen, userEvent } from 'tests/utils'

import { AccountReactivationSuccess } from './AccountReactivationSuccess'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/helpers/navigateToHome')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<AccountReactivationSuccess />', () => {
  it('should match snapshot', () => {
    render(<AccountReactivationSuccess />)

    expect(screen).toMatchSnapshot()
  })

  it('should go to home page when clicking on go to home button', async () => {
    render(<AccountReactivationSuccess />)

    const homeButton = screen.getByText('Découvrir le catalogue')
    await user.press(homeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
