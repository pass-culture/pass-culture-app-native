import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, userEvent, screen } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('LoggedOutHeader', () => {
  beforeEach(() => setFeatureFlags([]))

  it('should navigate to the SignupForm page', async () => {
    render(reactQueryProviderHOC(<LoggedOutHeader />))

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupMethods', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should navigate to the LoginMethods page', async () => {
    render(reactQueryProviderHOC(<LoggedOutHeader />))

    const signinButton = screen.getByText('Se connecter')
    await user.press(signinButton)

    expect(navigate).toHaveBeenCalledWith('LoginMethods', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should log analytics when clicking on "Créer un compte"', async () => {
    render(reactQueryProviderHOC(<LoggedOutHeader />))

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(analytics.logProfilSignUp).toHaveBeenCalledTimes(1)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'profile' })
  })

  it('should not display subtitle', () => {
    render(reactQueryProviderHOC(<LoggedOutHeader />))

    const subtitle = 'Tu as 17 ou 18 ans\u00a0?'

    expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
  })
})
