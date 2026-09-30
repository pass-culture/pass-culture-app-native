import React from 'react'

import { useResendEmail } from 'features/auth/helpers/useResendEmail'
import { render, screen, userEvent } from 'tests/utils'

import { LoginWithOneTimePassword } from './LoginWithOneTimePassword'

const user = userEvent.setup()

const mockNavigateToHomeWithReset = jest.fn()
const mockHandleResendEmail = jest.fn()

jest.mock('features/auth/helpers/useResendEmail')
jest.mock('features/navigation/helpers/useNavigateToHomeWithReset', () => ({
  useNavigateToHomeWithReset: () => ({ navigateToHomeWithReset: mockNavigateToHomeWithReset }),
}))

const mockedUseResendEmail = jest.mocked(useResendEmail)

const getDefaultResendState = () => ({
  resendCountdown: 0,
  resendAttempts: 0,
  isInitialized: true,
  isCooldownActive: false,
  hasReachedMaxAttempts: false,
  isDisabled: false,
  handleResendEmail: mockHandleResendEmail,
})

describe('LoginWithOneTimePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseResendEmail.mockReturnValue(getDefaultResendState())
  })

  it('should match snapshot', () => {
    render(<LoginWithOneTimePassword />)

    expect(screen).toMatchSnapshot()
  })

  it('should render the verification code inputs', () => {
    render(<LoginWithOneTimePassword />)

    expect(
      screen.getByLabelText(
        'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 1 sur 6'
      )
    ).toBeOnTheScreen()

    expect(
      screen.getByLabelText(
        'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 6 sur 6'
      )
    ).toBeOnTheScreen()
  })

  it('should not render the screen before resend state is initialized', () => {
    mockedUseResendEmail.mockReturnValueOnce({ ...getDefaultResendState(), isInitialized: false })

    render(<LoginWithOneTimePassword />)

    expect(screen.queryByText('Consulte ta boîte mail')).not.toBeOnTheScreen()
  })

  it('should disable the continue button when the code is incomplete', () => {
    render(<LoginWithOneTimePassword />)

    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()
  })

  it('should enable the continue button when the code is complete', async () => {
    render(<LoginWithOneTimePassword />)

    const firstInput = screen.getByLabelText(
      'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 1 sur 6'
    )

    await user.paste(firstInput, '123456')

    expect(screen.getByRole('button', { name: 'Continuer' })).toBeEnabled()
  })

  it('should navigate home when continuing with a complete code', async () => {
    render(<LoginWithOneTimePassword />)

    const firstInput = screen.getByLabelText(
      'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 1 sur 6'
    )

    await user.paste(firstInput, '123456')
    await user.press(screen.getByRole('button', { name: 'Continuer' }))

    expect(mockNavigateToHomeWithReset).toHaveBeenCalledTimes(1)
  })

  it('should request a new email when pressing the resend button', async () => {
    render(<LoginWithOneTimePassword />)

    const resendButton = screen.getByRole('button', { name: 'Renvoyer l’email' })

    await user.press(resendButton)

    expect(mockHandleResendEmail).toHaveBeenCalledTimes(1)
  })

  it('should display the remaining number of attempts', () => {
    mockedUseResendEmail.mockReturnValueOnce({ ...getDefaultResendState(), resendAttempts: 1 })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByText('Attention, il te reste 4 tentatives')).toBeOnTheScreen()
  })

  it('should disable the resend button during the cooldown', () => {
    mockedUseResendEmail.mockReturnValueOnce({
      ...getDefaultResendState(),
      resendCountdown: 30,
      isCooldownActive: true,
      isDisabled: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByRole('button', { name: 'Renvoyer l’email' })).toBeDisabled()
  })

  it('should display the cooldown message', () => {
    mockedUseResendEmail.mockReturnValueOnce({
      ...getDefaultResendState(),
      resendCountdown: 30,
      isCooldownActive: true,
      isDisabled: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByText('Un nouveau code t’a été envoyé.')).toBeOnTheScreen()
    expect(screen.getByText(/Tu pourras effectuer une nouvelle demande dans/)).toBeOnTheScreen()
    expect(screen.getByText('30 secondes')).toBeOnTheScreen()
  })

  it('should display the countdown in minutes', () => {
    mockedUseResendEmail.mockReturnValueOnce({
      ...getDefaultResendState(),
      resendCountdown: 120,
      isCooldownActive: true,
      isDisabled: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByText('2 minutes')).toBeOnTheScreen()
  })

  it('should display the maximum attempts message', () => {
    mockedUseResendEmail.mockReturnValueOnce({
      ...getDefaultResendState(),
      resendAttempts: 5,
      resendCountdown: 60,
      isCooldownActive: true,
      hasReachedMaxAttempts: true,
      isDisabled: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByText('Tu as effectué trop de demandes.')).toBeOnTheScreen()
    expect(
      screen.getByText(
        /Tu as effectué trop de demandes\. Tu pourras effectuer une nouvelle demande dans/
      )
    ).toBeOnTheScreen()
    expect(screen.getByText('1 minute')).toBeOnTheScreen()
  })

  it('should not display the remaining attempts when the maximum is reached', () => {
    mockedUseResendEmail.mockReturnValueOnce({
      ...getDefaultResendState(),
      resendAttempts: 5,
      hasReachedMaxAttempts: true,
      isDisabled: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.queryByText(/tentative/)).not.toBeOnTheScreen()
  })

  it('should disable the continue button when resend is disabled', () => {
    mockedUseResendEmail.mockReturnValueOnce({ ...getDefaultResendState(), isDisabled: true })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()
  })
})
