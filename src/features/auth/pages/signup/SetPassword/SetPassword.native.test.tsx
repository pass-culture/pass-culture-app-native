import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { SetPassword } from './SetPassword'

const props = {
  goToNextStep: jest.fn(),
  signUp: jest.fn(),
  isSSOSubscription: false,
  previousSignupData: {
    email: '',
    marketingEmailSubscription: false,
    password: '',
    birthdate: '',
  },
  onSSOEmailNotFoundError: jest.fn(),
  onDefaultEmailSignup: jest.fn(),
}

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('SetPassword Page', () => {
  it('should render correctly', () => {
    render(<SetPassword {...props} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display security rules', () => {
    render(<SetPassword {...props} />)

    expect(screen.getByText('12 caractères')).toBeOnTheScreen()
  })

  it('should not display "Obligatoire"', () => {
    render(<SetPassword {...props} />)

    expect(screen.queryByText('Obligatoire')).toBeNull()
  })

  it('should disable the submit button when password is incorrect', () => {
    render(<SetPassword {...props} />)

    expect(screen.getByTestId('Continuer')).toBeDisabled()
  })

  it('should enable the submit button when password is correct', async () => {
    render(<SetPassword {...props} />)

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    await user.type(passwordInput, 'user@AZERTY123')

    expect(await screen.findByTestId('Continuer')).toBeEnabled()
  })

  it('should go to next step when submitting password', async () => {
    render(<SetPassword {...props} />)

    const passwordInput = screen.getByPlaceholderText('Ton mot de passe')
    await user.type(passwordInput, 'user@AZERTY123')

    await user.press(screen.getByTestId('Continuer'))

    expect(props.goToNextStep).toHaveBeenCalledWith({ password: 'user@AZERTY123' })
  })
})
