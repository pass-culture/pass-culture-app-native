import React from 'react'

import { useOneTimePasswordAttempts } from 'features/auth/helpers/useOneTimePasswordAttempts'
import { useResendEmail } from 'features/auth/helpers/useResendEmail'
import { render, screen, userEvent } from 'tests/utils'

import { LoginWithOneTimePassword } from './LoginWithOneTimePassword'

const user = userEvent.setup()

const mockNavigate = jest.fn()
const mockNavigateToHomeWithReset = jest.fn()
const mockHandleResendEmail = jest.fn()
const mockRegisterFailedAttempt = jest.fn()
const mockClearCodeError = jest.fn()

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}))

jest.mock('features/auth/helpers/useResendEmail')

jest.mock('features/auth/helpers/useOneTimePasswordAttempts', () => ({
  useOneTimePasswordAttempts: jest.fn(),
}))

jest.mock('features/navigation/helpers/useNavigateToHomeWithReset', () => ({
  useNavigateToHomeWithReset: () => ({
    navigateToHomeWithReset: mockNavigateToHomeWithReset,
  }),
}))

const mockedUseResendEmail = jest.mocked(useResendEmail)
const mockedUseOneTimePasswordAttempts = jest.mocked(useOneTimePasswordAttempts)

const getDefaultResendState = () => ({
  resendCountdown: 0,
  resendAttempts: 0,
  isInitialized: true,
  isCooldownActive: false,
  hasReachedMaxAttempts: false,
  isDisabled: false,
  handleResendEmail: mockHandleResendEmail,
})

const getDefaultCodeAttemptsState = () => ({
  failedAttempts: 0,
  codeError: undefined,
  remainingSeconds: 0,
  registerFailedAttempt: mockRegisterFailedAttempt,
  clearCodeError: mockClearCodeError,
  hasReachedMaxCodeAttempts: false,
  isLastAttempt: false,
  maxCodeAttempts: 5,
  loginEmail: 'adresse@mail.com',
  saveLoginEmail: jest.fn(),
})

const FIRST_INPUT_LABEL =
  'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 1 sur 6'

const LAST_INPUT_LABEL =
  'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 6 sur 6'

describe('LoginWithOneTimePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockRegisterFailedAttempt.mockResolvedValue(false)
    mockHandleResendEmail.mockResolvedValue(undefined)

    mockedUseResendEmail.mockReturnValue(getDefaultResendState())
    mockedUseOneTimePasswordAttempts.mockReturnValue(getDefaultCodeAttemptsState())
  })

  it('should match snapshot', () => {
    render(<LoginWithOneTimePassword />)

    expect(screen).toMatchSnapshot()
  })

  it('should render the verification code inputs', () => {
    render(<LoginWithOneTimePassword />)

    expect(screen.getByLabelText(FIRST_INPUT_LABEL)).toBeOnTheScreen()
    expect(screen.getByLabelText(LAST_INPUT_LABEL)).toBeOnTheScreen()
  })

  it('should disable the continue button when the code is incomplete', () => {
    render(<LoginWithOneTimePassword />)

    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()
  })

  it('should enable the continue button when the code is complete', async () => {
    render(<LoginWithOneTimePassword />)

    await user.paste(screen.getByLabelText(FIRST_INPUT_LABEL), '123456')

    expect(screen.getByRole('button', { name: 'Continuer' })).toBeEnabled()
  })

  it('should navigate home when continuing with a valid code', async () => {
    render(<LoginWithOneTimePassword />)

    await user.paste(screen.getByLabelText(FIRST_INPUT_LABEL), '123456')
    await user.press(screen.getByRole('button', { name: 'Continuer' }))

    expect(mockNavigateToHomeWithReset).toHaveBeenCalledTimes(1)
    expect(mockRegisterFailedAttempt).not.toHaveBeenCalled()
  })

  it('should register a failed attempt when continuing with an invalid code', async () => {
    render(<LoginWithOneTimePassword />)

    await user.paste(screen.getByLabelText(FIRST_INPUT_LABEL), '654321')
    await user.press(screen.getByRole('button', { name: 'Continuer' }))

    expect(mockRegisterFailedAttempt).toHaveBeenCalledTimes(1)
    expect(mockNavigateToHomeWithReset).not.toHaveBeenCalled()
  })

  it('should navigate to the limit page when the maximum number of code attempts is reached', async () => {
    mockRegisterFailedAttempt.mockResolvedValueOnce(true)

    render(<LoginWithOneTimePassword />)

    await user.paste(screen.getByLabelText(FIRST_INPUT_LABEL), '654321')
    await user.press(screen.getByRole('button', { name: 'Continuer' }))

    expect(mockNavigate).toHaveBeenCalledWith('OneTimePasswordLimit')
    expect(mockNavigateToHomeWithReset).not.toHaveBeenCalled()
  })

  it('should disable the inputs and buttons when the account is locked', () => {
    mockedUseOneTimePasswordAttempts.mockReturnValueOnce({
      ...getDefaultCodeAttemptsState(),
      failedAttempts: 5,
      remainingSeconds: 3600,
      hasReachedMaxCodeAttempts: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByLabelText(FIRST_INPUT_LABEL)).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Renvoyer l’email' })).toBeDisabled()
    expect(mockRegisterFailedAttempt).not.toHaveBeenCalled()
  })

  it('should display the account locked message', () => {
    mockedUseOneTimePasswordAttempts.mockReturnValueOnce({
      ...getDefaultCodeAttemptsState(),
      failedAttempts: 5,
      remainingSeconds: 300,
      hasReachedMaxCodeAttempts: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(
      screen.getByText('Le compte adresse@mail.com est temporairement inaccessible.')
    ).toBeOnTheScreen()

    expect(screen.getByText(/tu pourras te reconnecter dans/)).toBeOnTheScreen()
  })

  it('should display the last attempt warning', () => {
    mockedUseOneTimePasswordAttempts.mockReturnValueOnce({
      ...getDefaultCodeAttemptsState(),
      failedAttempts: 4,
      isLastAttempt: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByText('Attention, il ne te reste qu’un essai.')).toBeOnTheScreen()

    expect(
      screen.getByText(/ton compte sera temporairement suspendu pendant 1 heure/)
    ).toBeOnTheScreen()
  })

  it('should display the remaining number of code attempts', () => {
    mockedUseOneTimePasswordAttempts.mockReturnValueOnce({
      ...getDefaultCodeAttemptsState(),
      failedAttempts: 1,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByText('4 essais')).toBeOnTheScreen()
  })

  it('should not display the remaining code attempts when the maximum is reached', () => {
    mockedUseOneTimePasswordAttempts.mockReturnValueOnce({
      ...getDefaultCodeAttemptsState(),
      failedAttempts: 5,
      remainingSeconds: 3600,
      hasReachedMaxCodeAttempts: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.queryByText(/tentative/)).not.toBeOnTheScreen()
  })

  it('should request a new email when pressing the resend button', async () => {
    render(<LoginWithOneTimePassword />)

    await user.press(screen.getByRole('button', { name: 'Renvoyer l’email' }))

    expect(mockHandleResendEmail).toHaveBeenCalledTimes(1)
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

  it('should disable the resend button when the maximum resend attempts is reached', () => {
    mockedUseResendEmail.mockReturnValueOnce({
      ...getDefaultResendState(),
      resendAttempts: 5,
      hasReachedMaxAttempts: true,
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
    expect(screen.getByText(/Tu pourras demander un nouveau code dans/)).toBeOnTheScreen()
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

  it('should not register a failed attempt when the code is incomplete', async () => {
    render(<LoginWithOneTimePassword />)

    await user.press(screen.getByRole('button', { name: 'Continuer' }))

    expect(mockRegisterFailedAttempt).not.toHaveBeenCalled()
  })

  it('should not register a failed attempt when the account is already locked', async () => {
    mockedUseOneTimePasswordAttempts.mockReturnValueOnce({
      ...getDefaultCodeAttemptsState(),
      failedAttempts: 5,
      remainingSeconds: 3600,
      hasReachedMaxCodeAttempts: true,
    })

    render(<LoginWithOneTimePassword />)

    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()
    expect(mockRegisterFailedAttempt).not.toHaveBeenCalled()
  })
})
