import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

import { render, screen, userEvent, waitFor } from 'tests/utils'

import { LoginWithOneTimePassword } from './LoginWithOneTimePassword'

const user = userEvent.setup()

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

describe('LoginWithOneTimePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null)
    jest.mocked(AsyncStorage.setItem).mockResolvedValue(undefined)
    jest.mocked(AsyncStorage.removeItem).mockResolvedValue(undefined)
  })

  it('should match snapshot', async () => {
    render(<LoginWithOneTimePassword />)

    await waitFor(() => expect(screen.getByText('Consulte ta boîte mail')).toBeOnTheScreen())

    expect(screen).toMatchSnapshot()
  })

  it('should render the verification code inputs', async () => {
    render(<LoginWithOneTimePassword />)

    expect(
      await screen.findByLabelText(
        'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 1 sur 6'
      )
    ).toBeOnTheScreen()

    expect(
      screen.getByLabelText(
        'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 6 sur 6'
      )
    ).toBeOnTheScreen()
  })

  it('should disable the continue button when the code is incomplete', async () => {
    render(<LoginWithOneTimePassword />)

    const continueButton = await screen.findByRole('button', { name: 'Continuer' })

    expect(continueButton).toBeDisabled()
  })

  it('should enable the continue button when the code is complete', async () => {
    render(<LoginWithOneTimePassword />)

    const firstInput = await screen.findByLabelText(
      'Saisis le code de vérification que tu as reçu à l’adresse adresse@mail.com - caractère 1 sur 6'
    )

    await user.paste(firstInput, '123456')

    expect(screen.getByRole('button', { name: 'Continuer' })).toBeEnabled()
  })

  it('should allow requesting a new email', async () => {
    render(<LoginWithOneTimePassword />)

    const resendButton = await screen.findByRole('button', { name: 'Renvoyer l’email' })

    expect(resendButton).toBeEnabled()

    await user.press(resendButton)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'login-one-time-password-resend-cooldown',
      expect.any(String)
    )

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'login-one-time-password-resend-attempts',
      '1'
    )

    expect(screen.getByText(/Tu pourras effectuer une nouvelle demande dans/)).toBeOnTheScreen()
  })

  it('should display the remaining number of attempts after requesting a new email', async () => {
    render(<LoginWithOneTimePassword />)

    await user.press(await screen.findByRole('button', { name: 'Renvoyer l’email' }))

    expect(screen.getByText('Attention, il te reste 4 tentatives')).toBeOnTheScreen()
  })

  it('should disable the resend button after requesting a new email', async () => {
    render(<LoginWithOneTimePassword />)

    const resendButton = await screen.findByRole('button', { name: 'Renvoyer l’email' })
    await user.press(resendButton)

    expect(resendButton).toBeDisabled()
  })

  it('should restore the resend state from AsyncStorage', async () => {
    const cooldownEnd = Date.now() + 60_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce('2')

    render(<LoginWithOneTimePassword />)

    expect(await screen.findByText('Attention, il te reste 3 tentatives')).toBeOnTheScreen()

    expect(screen.getByText(/Tu pourras effectuer une nouvelle demande dans/)).toBeOnTheScreen()

    expect(screen.getByRole('button', { name: 'Renvoyer l’email' })).toBeDisabled()
  })

  it('should remove expired cooldown from AsyncStorage', async () => {
    const expiredCooldown = Date.now() - 1_000

    jest.mocked(AsyncStorage.getItem).mockImplementationOnce(async (key) => {
      if (key === 'login-one-time-password-resend-cooldown') return String(expiredCooldown)
      if (key === 'login-one-time-password-resend-attempts') return '2'
      return null
    })

    render(<LoginWithOneTimePassword />)

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'login-one-time-password-resend-cooldown'
      )
    })

    expect(screen.getByRole('button', { name: 'Renvoyer l’email' })).toBeEnabled()
  })

  it('should block resend after the fifth attempt', async () => {
    const cooldownEnd = Date.now() + 60_000

    jest
      .mocked(AsyncStorage.getItem)
      .mockResolvedValueOnce(String(cooldownEnd))
      .mockResolvedValueOnce('5')

    render(<LoginWithOneTimePassword />)

    expect(await screen.findByText('Tu as effectué trop de demandes.')).toBeOnTheScreen()

    expect(screen.getByRole('button', { name: 'Renvoyer l’email' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Continuer' })).toBeDisabled()
  })

  it('should use a one hour cooldown after the fifth attempt', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null).mockResolvedValueOnce('4')

    render(<LoginWithOneTimePassword />)

    const resendButton = await screen.findByRole('button', { name: 'Renvoyer l’email' })

    await user.press(resendButton)

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'login-one-time-password-resend-cooldown',
      expect.any(String)
    )

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'login-one-time-password-resend-attempts',
      '5'
    )

    expect(
      screen.getByText(
        'Tu as effectué trop de demandes. Tu pourras effectuer une nouvelle demande dans 60 minutes'
      )
    ).toBeOnTheScreen()
  })
})
