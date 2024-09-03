import React from 'react'

import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render, screen } from 'tests/utils'

import { DeleteProfileSuccess } from './DeleteProfileSuccess'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

const signOutMock = jest.fn()
jest.spyOn(LogoutRoutine, 'useLogoutRoutine').mockReturnValue(signOutMock)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('DeleteProfileSuccess component', () => {
  it('should render delete profile success', () => {
    render(<DeleteProfileSuccess />)

    expect(screen).toMatchSnapshot()
  })

  it('should log out user', () => {
    render(<DeleteProfileSuccess />)

    expect(signOutMock).toHaveBeenCalledTimes(1)
  })

  it('should redirect to Home page when clicking on "Retourner à l’accueil" button', () => {
    render(<DeleteProfileSuccess />)

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
