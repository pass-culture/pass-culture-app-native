import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OnboardingWelcome } from 'features/tutorial/pages/onboarding/OnboardingWelcome'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

describe('OnboardingWelcome', () => {
  it('should render correctly', () => {
    const renderAPI = render(<OnboardingWelcome />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to OnboardingGeolocation when "C’est parti !" is clicked', async () => {
    render(<OnboardingWelcome />)

    const button = screen.getByText('C’est parti\u00a0!')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('OnboardingGeolocation', undefined)
    })
  })

  it('should redirect to login when "Se connecter" is clicked', async () => {
    render(<OnboardingWelcome />)

    const loginButton = screen.getByText('Se connecter')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Login', { preventCancellation: true })
    })
  })

  it('should set has_seen_tutorials to true in local storage when "C’est parti !" is clicked', async () => {
    render(<OnboardingWelcome />)

    const button = screen.getByText('C’est parti\u00a0!')
    fireEvent.press(button)

    expect(await storage.readObject('has_seen_tutorials')).toBeTruthy()
  })

  it('should set has_seen_tutorials to true in local storage when "Se connecter" is clicked', async () => {
    render(<OnboardingWelcome />)

    const loginButton = screen.getByText('Se connecter')
    fireEvent.press(loginButton)

    expect(await storage.readObject('has_seen_tutorials')).toBeTruthy()
  })

  it('should log analytics when "C’est parti !" is clicked', async () => {
    render(<OnboardingWelcome />)

    const button = screen.getByText('C’est parti\u00a0!')
    fireEvent.press(button)

    expect(analytics.logOnboardingStarted).toHaveBeenCalledWith({ type: 'start' })
  })

  it('should log analytics when "Se connecter" is clicked', async () => {
    render(<OnboardingWelcome />)

    const loginButton = screen.getByText('Se connecter')
    fireEvent.press(loginButton)

    expect(analytics.logOnboardingStarted).toHaveBeenCalledWith({ type: 'login' })
  })
})
