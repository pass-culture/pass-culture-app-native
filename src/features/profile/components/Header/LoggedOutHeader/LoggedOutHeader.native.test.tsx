import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { render, userEvent, screen } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('LoggedOutHeader', () => {
  it('should navigate to the SignupForm page', async () => {
    render(
      <LoggedOutHeader
        featureFlags={{ enablePassForAll: false, disableActivation: false, enableProfileV2: false }}
      />
    )

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should navigate to the Login page', async () => {
    render(
      <LoggedOutHeader
        featureFlags={{ enablePassForAll: false, disableActivation: false, enableProfileV2: false }}
      />
    )

    const signinButton = screen.getByText('Se connecter')
    await user.press(signinButton)

    expect(navigate).toHaveBeenCalledWith('Login', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should log analytics when clicking on "Créer un compte"', async () => {
    render(
      <LoggedOutHeader
        featureFlags={{ enablePassForAll: false, disableActivation: false, enableProfileV2: false }}
      />
    )

    const signupButton = screen.getByText('Créer un compte')
    await user.press(signupButton)

    expect(analytics.logProfilSignUp).toHaveBeenCalledTimes(1)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'profile' })
  })

  it('should display subtitle with credit', () => {
    render(
      <LoggedOutHeader
        featureFlags={{ enablePassForAll: false, disableActivation: false, enableProfileV2: false }}
      />
    )

    const subtitle = 'Tu as 17 ou 18 ans\u00a0?'

    expect(screen.getByText(subtitle)).toBeOnTheScreen()
  })

  it('should not display subtitle with passForAll enabled', () => {
    render(
      <LoggedOutHeader
        featureFlags={{ enablePassForAll: true, disableActivation: false, enableProfileV2: false }}
      />
    )

    const subtitle = 'Tu as 17 ou 18 ans\u00a0?'

    expect(screen.queryByText(subtitle)).not.toBeOnTheScreen()
  })
})
