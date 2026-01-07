import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as LogoutRoutine from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { setSettings } from 'tests/setSettings'
import { render, screen, userEvent } from 'tests/utils'

import { DeactivateProfileSuccess } from './DeactivateProfileSuccess'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

const signOutMock = jest.fn()
jest.spyOn(LogoutRoutine, 'useLogoutRoutine').mockReturnValue(signOutMock)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('DeactivateProfileSuccess component', () => {
  beforeEach(() => {
    setSettings({ accountUnsuspensionLimit: 60 })
  })

  it('should render delete profile success', async () => {
    render(reactQueryProviderHOC(<DeactivateProfileSuccess />))

    await screen.findByText(
      'Tu as 60 jours pour changer d’avis. Tu pourras facilement réactiver ton compte en te connectant.'
    )

    expect(screen).toMatchSnapshot()
  })

  it('should log out user', () => {
    render(reactQueryProviderHOC(<DeactivateProfileSuccess />))

    expect(signOutMock).toHaveBeenCalledTimes(1)
  })

  it('should redirect to Home page when clicking on "Retourner à l’accueil" button', async () => {
    render(reactQueryProviderHOC(<DeactivateProfileSuccess />))

    await user.press(screen.getByText(`Retourner à l’accueil`))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should log analytics and  redirect to Login page when clicking on "Réactiver mon compte" button', async () => {
    render(reactQueryProviderHOC(<DeactivateProfileSuccess />))

    await user.press(screen.getByText('Réactiver mon compte'))

    expect(analytics.logAccountReactivation).toHaveBeenCalledWith('deactivateprofilesuccess')
    expect(navigate).toHaveBeenCalledWith('Login', {
      from: StepperOrigin.DEACTIVATE_PROFILE_SUCCESS,
    })
  })
})
