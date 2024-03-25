import React from 'react'

import { NotificationsSettingsModal } from 'features/subscription/NotificationsSettingsModal'
import { SubscriptionTheme } from 'features/subscription/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'

const mockDismissModal = jest.fn()
const mockOnPressSaveChanges = jest.fn()

describe('<NotificationsSettingsModal />', () => {
  it('should dismiss modal on press rightIconButton', () => {
    renderModal(true)

    const dismissModalButton = screen.getByTestId('Ne pas s’abonner')

    fireEvent.press(dismissModalButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on press "Quitter sans enregistrer"', () => {
    renderModal(true)

    const goBackButton = screen.getByText('Tout refuser et ne pas recevoir d’actus')

    fireEvent.press(goBackButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal when saving changes', async () => {
    renderModal(true)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider'))
    })

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should call onPressSaveChanges when saving changes', async () => {
    renderModal(true)

    await act(async () => {
      fireEvent.press(screen.getByText('Valider'))
    })

    expect(mockOnPressSaveChanges).toHaveBeenCalledTimes(1)
  })

  it('should see "Cinéma" when theme is set accordingly', async () => {
    renderModal(true)

    expect(screen.getByText(/Cinéma/)).toBeTruthy()
  })
})

const renderModal = (visible: boolean) => {
  render(
    reactQueryProviderHOC(
      <NotificationsSettingsModal
        visible={visible}
        dismissModal={mockDismissModal}
        theme={SubscriptionTheme.CINEMA}
        onPressSaveChanges={mockOnPressSaveChanges}
      />
    )
  )
}
