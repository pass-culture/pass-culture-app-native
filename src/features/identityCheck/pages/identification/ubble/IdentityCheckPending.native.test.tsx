import React from 'react'

import { IdentityCheckPending } from 'features/identityCheck/pages/identification/ubble/IdentityCheckPending'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<IdentityCheckPending/>', () => {
  it('should render correctly', () => {
    render(<IdentityCheckPending />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to next screen after timeout', async () => {
    render(<IdentityCheckPending />)

    await user.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
