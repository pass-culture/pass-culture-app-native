import React from 'react'

import { UnsavedSettingsModal } from 'features/profile/pages/NotificationSettings/components/UnsavedSettingsModal'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const mockDismissModal = jest.fn()
const mockOnPressSaveChanges = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<UnsavedSettingsModal />', () => {
  it('should dismiss modal on press rightIconButton', async () => {
    renderModal(true)

    await user.press(screen.getByTestId('Ne pas quitter'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal on press "Quitter sans enregistrer"', async () => {
    renderModal(true)

    await user.press(screen.getByText('Quitter sans enregistrer'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should dismiss modal when saving changes', async () => {
    renderModal(true)

    await user.press(screen.getByText('Enregistrer mes modifications'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should call onPressSaveChanges when saving changes', async () => {
    renderModal(true)

    await user.press(screen.getByText('Enregistrer mes modifications'))

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
