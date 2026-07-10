import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

import { ChangePhoneNumber } from './ChangePhoneNumber'

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

describe('<ChangePhoneNumber/>', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({ user: { phoneNumber: '+33639980123' } })
  })

  it('should strip calling code when pasted in phone number input', async () => {
    renderChangePhoneNumber()

    const phoneInput = screen.getByTestId('Entrée pour le numéro de téléphone')
    await act(async () => fireEvent.changeText(phoneInput, '+33639980123'))

    await waitFor(() => {
      expect(screen.getByTestId('Entrée pour le numéro de téléphone').props.value).toBe('639980123')
    })
  })

  it('should show and clear validation error when value toggles invalid then valid', async () => {
    renderChangePhoneNumber()

    const phoneInput = screen.getByTestId('Entrée pour le numéro de téléphone')

    await act(async () => fireEvent.changeText(phoneInput, '063998012345678'))

    await waitFor(() => {
      expect(screen.getByText('Le numéro de téléphone est trop long')).toBeOnTheScreen()
      expect(screen.getByText('Continuer')).toBeDisabled()
    })

    await act(async () => fireEvent.changeText(phoneInput, '0639980123'))

    await waitFor(() => {
      expect(screen.queryByText('Le numéro de téléphone est trop long')).toBeNull()
      expect(screen.getByText('Continuer')).toBeEnabled()
    })
  })
})

const renderChangePhoneNumber = () => render(reactQueryProviderHOC(<ChangePhoneNumber />))
