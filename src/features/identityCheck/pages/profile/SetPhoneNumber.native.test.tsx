import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { SetPhoneNumber } from 'features/identityCheck/pages/profile/SetPhoneNumber'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const mockUseAuthContext = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('<SetPhoneNumber/>', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({ user: null })
  })

  it('should render correctly', () => {
    renderSetPhoneNumber({ type: ProfileTypes.IDENTITY_CHECK })

    expect(screen).toMatchSnapshot()
  })

  it('should pre-fill phone number when user already has one', async () => {
    mockUseAuthContext.mockReturnValueOnce({ user: { phoneNumber: '+33639980123' } })
    renderSetPhoneNumber({ type: ProfileTypes.IDENTITY_CHECK })

    const phoneInput = await screen.findByTestId('Entrée pour le numéro de téléphone')

    expect(phoneInput.props.value).toBe('639980123')
  })

  it('should not pre-fill phone number when user has none', async () => {
    renderSetPhoneNumber({ type: ProfileTypes.IDENTITY_CHECK })

    const phoneInput = await screen.findByTestId('Entrée pour le numéro de téléphone')

    expect(phoneInput.props.value).toBe('')
  })

  it('should disable the submit button when phone number is empty', async () => {
    renderSetPhoneNumber({ type: ProfileTypes.IDENTITY_CHECK })

    expect(screen.getByText('Continuer')).toBeDisabled()
  })

  it('should enable the submit button when a valid phone number is entered', async () => {
    renderSetPhoneNumber({ type: ProfileTypes.IDENTITY_CHECK })

    const phoneInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => fireEvent.changeText(phoneInput, '0639980123'))

    await waitFor(() => {
      expect(screen.getByText('Continuer')).toBeEnabled()
    })
  })

  it('should display an error message when phone number is too long', async () => {
    renderSetPhoneNumber({ type: ProfileTypes.IDENTITY_CHECK })

    const phoneInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => fireEvent.changeText(phoneInput, '063998012345678'))

    await waitFor(() => {
      expect(screen.getByText('Le numéro de téléphone est trop long')).toBeTruthy()
    })
  })

  it('should navigate to SetStatus with IDENTITY_CHECK type when submitting', async () => {
    renderSetPhoneNumber({ type: ProfileTypes.IDENTITY_CHECK })

    const phoneInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => fireEvent.changeText(phoneInput, '0639980123'))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenCalledWith('SetStatus', { type: ProfileTypes.IDENTITY_CHECK })
  })

  it('should navigate to SetStatus with booking type when submitting', async () => {
    renderSetPhoneNumber({ type: ProfileTypes.BOOKING_FREE_OFFER_15_16 })

    const phoneInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => fireEvent.changeText(phoneInput, '0639980123'))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenCalledWith('SetStatus', {
      type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
    })
  })

  it('should fallback to IDENTITY_CHECK type when no route params', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    renderSetPhoneNumber(undefined)

    const phoneInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => fireEvent.changeText(phoneInput, '0639980123'))

    await user.press(screen.getByText('Continuer'))

    expect(navigate).toHaveBeenCalledWith('SetStatus', { type: ProfileTypes.IDENTITY_CHECK })
  })
})

const renderSetPhoneNumber = (navigationParams: { type: string } | undefined) => {
  useRoute.mockReturnValue({ params: navigationParams })
  return render(<SetPhoneNumber />)
}
