import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { fireEvent, render, screen } from 'tests/utils'

import { OnboardingGeneralPublicWelcome } from './OnboardingGeneralPublicWelcome'

describe('OnboardingGeneralPublicWelcome', () => {
  it('should render correctly', () => {
    render(<OnboardingGeneralPublicWelcome />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SignupForm when pressing "Créer un compte"', () => {
    render(<OnboardingGeneralPublicWelcome />)

    const signupButton = screen.getByText('Créer un compte')
    fireEvent.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: 'OnboardingGeneralPublicWelcome',
    })
  })

  it('should reset navigation on go to Home when pressing "Accéder au catalogue"', () => {
    render(<OnboardingGeneralPublicWelcome />)

    const signupButton = screen.getByText('Accéder au catalogue')
    fireEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
  })

  it('should reset navigation on go to Home when pressing "Plus tard"', () => {
    render(<OnboardingGeneralPublicWelcome />)

    const signupButton = screen.getByText('Passer')
    fireEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
  })
})
