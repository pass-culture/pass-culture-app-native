import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { DeactivateProfileSuccess } from './DeactivateProfileSuccess'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')
jest.mock('features/auth/context/SettingsContext')

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

describe('DeactivateProfileSuccess component', () => {
  it('should render delete profile success', () => {
    render(<DeactivateProfileSuccess />)

    expect(screen).toMatchSnapshot()
  })

  it('should log out user', () => {
    render(<DeactivateProfileSuccess />)

    expect(signOutMock).toHaveBeenCalledTimes(1)
  })

  it('should redirect to Home page when clicking on "Retourner à l’accueil" button', () => {
    render(<DeactivateProfileSuccess />)

    fireEvent.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should log analytics and  redirect to Login page when clicking on "Réactiver mon compte" button', async () => {
    render(<DeactivateProfileSuccess />)

    fireEvent.press(screen.getByText('Réactiver mon compte'))

    await waitFor(() => {
      expect(analytics.logAccountReactivation).toHaveBeenCalledWith('deactivateprofilesuccess')
      expect(navigate).toHaveBeenCalledWith('Login', {
        from: StepperOrigin.DEACTIVATE_PROFILE_SUCCESS,
      })
    })
  })
})
