import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, userEvent, screen } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

const user = userEvent.setup()
jest.useFakeTimers()

describe('LoggedOutHeader', () => {
  beforeEach(() => setFeatureFlags())

  it('should display banner with credit V2 subtitle', () => {
    render(<LoggedOutHeader />)

    const subtitle = 'Tu as entre 15 et 18 ans\u00a0?'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  it('should navigate to the SignupForm page', async () => {
    render(<LoggedOutHeader />)

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should navigate to the Login page', async () => {
    render(<LoggedOutHeader />)

    const signinButton = screen.getByText('Se connecter')
    await user.press(signinButton)

    expect(navigate).toHaveBeenCalledWith('Login', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should log analytics when clicking on "Créer un compte"', async () => {
    render(<LoggedOutHeader />)

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(analytics.logProfilSignUp).toHaveBeenCalledTimes(1)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'profile' })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CREDIT_V3]))

    it('should display banner with credit V3 subtitle', () => {
      render(<LoggedOutHeader />)

      const subtitle = 'Tu as entre 17 et 18 ans\u00a0?'

      expect(screen.getByText(subtitle)).toBeOnTheScreen()
    })
  })
})
