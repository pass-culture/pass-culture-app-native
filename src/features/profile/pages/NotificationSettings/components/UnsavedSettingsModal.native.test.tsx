import React from 'react'

import { UnsavedSettingsModal } from 'features/profile/pages/NotificationSettings/components/UnsavedSettingsModal'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'

const mockDismissModal = jest.fn()
const mockOnPressSaveChanges = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<UnsavedSettingsModal />', () => {
  it('should dismiss modal on press rightIconButton', () => {
    renderModal(true)

    const dismissModalButton = screen.getByTestId('Ne pas quitter')

    fireEvent.press(dismissModalButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on press "Quitter sans enregistrer"', () => {
    renderModal(true)

    const goBackButton = screen.getByText('Quitter sans enregistrer')

    fireEvent.press(goBackButton)

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal when saving changes', async () => {
    renderModal(true)

    await act(async () => {
      fireEvent.press(screen.getByText('Enregistrer mes modifications'))
    })

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should call onPressSaveChanges when saving changes', async () => {
    renderModal(true)

    await act(async () => {
      fireEvent.press(screen.getByText('Enregistrer mes modifications'))
    })

    expect(mockOnPressSaveChanges).toHaveBeenCalledTimes(1)
  })
})

const renderModal = (visible: boolean) => {
  render(
    reactQueryProviderHOC(
      <UnsavedSettingsModal
        visible={visible}
        dismissModal={mockDismissModal}
        onPressSaveChanges={mockOnPressSaveChanges}
      />
    )
  )
}
