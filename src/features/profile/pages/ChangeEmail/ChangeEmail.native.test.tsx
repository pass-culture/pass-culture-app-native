import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { ChangeEmail } from './ChangeEmail'

jest.mock('features/auth/context/AuthContext')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<ChangeEmail/>', () => {
  it('should render correctly', async () => {
    renderChangeEmail()

    await screen.findByText('Modifier mon e-mail')

    expect(screen).toMatchSnapshot()
  })

  it('should display the change email label', async () => {
    renderChangeEmail()

    const fieldLabel = await screen.findByText('Adresse e-mail actuelle')

    expect(fieldLabel).toBeOnTheScreen()
  })

  it('should display the email input', async () => {
    renderChangeEmail()

    const validationButton = await screen.findByTestId(
      'Valider la demande de modification de mon e-mail'
    )

    expect(validationButton).toBeOnTheScreen()
  })

  describe('from DeleteProfileReason', () => {
    it('should show DeleteProfileReasonNewEmailModal when showModal params is set to true', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })
      renderChangeEmail()

      await screen.findByText('Modifier mon e-mail')

      expect(screen.getByText('Modifie ton adresse e-mail sur ce compte')).toBeOnTheScreen()
    })

    it('should not show DeleteProfileReasonNewEmailModal when showModal params is set to false', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: false } })
      renderChangeEmail()

      await screen.findByText('Modifier mon e-mail')

      expect(screen.queryByText('Modifie ton adresse e-mail sur ce compte')).not.toBeOnTheScreen()
    })

    it('should hide DeleteProfileReasonNewEmailModal when clicking on "Fermer la modale"', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })
      renderChangeEmail()

      const closeButton = screen.getByLabelText('Fermer la modale')
      fireEvent.press(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Modifie ton adresse e-mail sur ce compte')).not.toBeOnTheScreen()
      })
    })
  })
})

const renderChangeEmail = () => render(reactQueryProviderHOC(<ChangeEmail />))
