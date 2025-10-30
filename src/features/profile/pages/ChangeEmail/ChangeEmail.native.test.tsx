import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen, userEvent, waitFor, waitForButtonToBePressable } from 'tests/utils'

import { ChangeEmail } from './ChangeEmail'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/subcategories/useSubcategories')
jest.mock('features/auth/context/AuthContext')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('<ChangeEmail/>', () => {
  it('should render correctly', async () => {
    await renderChangeEmail()

    await screen.findByText('Modifier mon e-mail')

    expect(screen).toMatchSnapshot()
  })

  it('should display the change email label', async () => {
    await renderChangeEmail()

    const fieldLabel = await screen.findByText('Adresse e-mail actuelle', { hidden: true })

    expect(fieldLabel).toBeOnTheScreen()
  })

  it('should display the email input', async () => {
    await renderChangeEmail()

    const validationButton = await screen.findByTestId(
      'Valider la demande de modification de mon e-mail'
    )

    expect(validationButton).toBeOnTheScreen()
  })

  describe('from DeleteProfileReason', () => {
    it('should show DeleteProfileReasonNewEmailModal when showModal params is set to true', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })
      await renderChangeEmail()

      await screen.findByText('Modifier mon e-mail')

      expect(await screen.findByText('Modifie ton adresse e-mail sur ce compte')).toBeOnTheScreen()
    })

    it('should not show DeleteProfileReasonNewEmailModal when showModal params is set to false', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: false } })
      await renderChangeEmail()

      await screen.findByText('Modifier mon e-mail')

      expect(screen.queryByText('Modifie ton adresse e-mail sur ce compte')).not.toBeOnTheScreen()
    })

    it('should hide DeleteProfileReasonNewEmailModal when clicking on "Fermer la modale"', async () => {
      useRoute.mockReturnValueOnce({ params: { showModal: true } })
      await renderChangeEmail()

      const closeButton = await screen.findByLabelText('Fermer la modale')

      await waitForButtonToBePressable(closeButton)
      await user.press(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Modifie ton adresse e-mail sur ce compte')).not.toBeOnTheScreen()
      })
    })
  })
})

const renderChangeEmail = () => renderAsync(reactQueryProviderHOC(<ChangeEmail />))
