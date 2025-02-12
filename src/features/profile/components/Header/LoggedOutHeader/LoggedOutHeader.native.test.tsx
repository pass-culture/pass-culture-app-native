import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { setSettings } from 'features/auth/tests/setSettings'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, userEvent, screen } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('LoggedOutHeader', () => {
  beforeEach(() => setFeatureFlags())

  it('should display subtitle with credit V2', () => {
    render(<LoggedOutHeader showRemoteBanner={false} />)

    const subtitle = 'Tu as entre 15 et 18 ans\u00a0?'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  it('should navigate to the SignupForm page', async () => {
    render(<LoggedOutHeader showRemoteBanner={false} />)

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should navigate to the Login page', async () => {
    render(<LoggedOutHeader showRemoteBanner={false} />)

    const signinButton = screen.getByText('Se connecter')
    await user.press(signinButton)

    expect(navigate).toHaveBeenCalledWith('Login', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should log analytics when clicking on "Créer un compte"', async () => {
    render(<LoggedOutHeader showRemoteBanner={false} />)

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(analytics.logProfilSignUp).toHaveBeenCalledTimes(1)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'profile' })
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      setSettings({ wipEnableCreditV3: true })
    })

    it('should display subtitle with credit V3', () => {
      render(<LoggedOutHeader showRemoteBanner={false} />)

      const subtitle = 'Tu as 17 ou 18 ans\u00a0?'

      expect(screen.getByText(subtitle)).toBeOnTheScreen()
    })

    it('should not display subtitle with passForAll enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL])

      render(<LoggedOutHeader showRemoteBanner={false} />)

      const subtitle = 'Tu as 17 ou 18 ans\u00a0?'

      expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
    })
  })
})
