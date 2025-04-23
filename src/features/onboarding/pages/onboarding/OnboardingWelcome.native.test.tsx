import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { OnboardingWelcome } from 'features/onboarding/pages/onboarding/OnboardingWelcome'
import { analytics } from 'libs/analytics/provider'
import { storage } from 'libs/storage'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('OnboardingWelcome', () => {
  it('should render correctly', () => {
    render(<OnboardingWelcome />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to OnboardingGeolocation when "C’est parti !" is clicked', async () => {
    render(<OnboardingWelcome />)

    const button = screen.getByText('C’est parti\u00a0!')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('OnboardingStackNavigator', {
      params: undefined,
      screen: 'OnboardingGeolocation',
    })
  })

  it('should redirect to login when "Se connecter" is clicked', async () => {
    render(<OnboardingWelcome />)

    const loginButton = screen.getByText('Se connecter')
    await user.press(loginButton)

    expect(navigate).toHaveBeenCalledWith('Login', { from: StepperOrigin.ONBOARDING_WELCOME })
  })

  it('should set has_seen_tutorials to true in local storage when "C’est parti !" is clicked', async () => {
    render(<OnboardingWelcome />)

    const button = screen.getByText('C’est parti\u00a0!')
    await user.press(button)

    expect(await storage.readObject('has_seen_tutorials')).toBeTruthy()
  })

  it('should set has_seen_tutorials to true in local storage when "Se connecter" is clicked', async () => {
    render(<OnboardingWelcome />)

    const loginButton = screen.getByText('Se connecter')
    await user.press(loginButton)

    expect(await storage.readObject('has_seen_tutorials')).toBeTruthy()
  })

  it('should log analytics when "C’est parti !" is clicked', async () => {
    render(<OnboardingWelcome />)

    const button = screen.getByText('C’est parti\u00a0!')
    await user.press(button)

    expect(analytics.logOnboardingStarted).toHaveBeenCalledWith({ type: 'start' })
  })

  it('should log analytics when "Se connecter" is clicked', async () => {
    render(<OnboardingWelcome />)

    const loginButton = screen.getByText('Se connecter')
    await user.press(loginButton)

    expect(analytics.logOnboardingStarted).toHaveBeenCalledWith({ type: 'login' })
  })
})
