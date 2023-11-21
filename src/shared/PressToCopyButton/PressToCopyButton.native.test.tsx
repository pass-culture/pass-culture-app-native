import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'
import React from 'react'

import { PressToCopyButton } from 'shared/PressToCopyButton/PressToCopyButton'
import { act, fireEvent, render, screen } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))
const snackBarMessage = 'Copié avec succès\u00a0!'
const wording = 'Copier l’adresse'
const textToCopy = 'Le sucre, 69002 LYON'

describe('PressToCopyButton', () => {
  it('should show right text', async () => {
    renderPressToCopyButton()

    const button = screen.getByText(wording)

    expect(button).toBeTruthy()
  })

  it('should call setString of clipboard on press', async () => {
    renderPressToCopyButton()
    const button = screen.getByText(wording)

    await act(async () => {
      fireEvent.press(button)
    })

    expect(mockClipboard.setString).toHaveBeenCalledWith(textToCopy)
  })

  it('should show success snack bar', async () => {
    mockClipboard.setString = jest.fn()

    renderPressToCopyButton()
    const button = screen.getByText(wording)

    await act(async () => {
      fireEvent.press(button)
    })

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: snackBarMessage,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })
})

function renderPressToCopyButton() {
  return render(
    <PressToCopyButton
      wording={wording}
      textToCopy={textToCopy}
      snackBarMessage={snackBarMessage}
    />
  )
}
