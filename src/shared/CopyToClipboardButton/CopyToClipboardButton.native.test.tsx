import Clipboard from '@react-native-clipboard/clipboard'
import React from 'react'

import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { act, fireEvent, render, screen } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('@react-native-clipboard/clipboard')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))
const successSnackBarMessage = 'Copié avec succès\u00a0!'
const errorSnackBarMessage = 'Une erreur est survenue, veuillez réessayer'
const wording = 'Copier l’adresse'
const textToCopy = 'Le sucre, 69002 LYON'

describe('CopyToClipboardButton', () => {
  it('should show right text', async () => {
    renderCopyToClipboardButton()

    const button = screen.getByText(wording)

    expect(button).toBeTruthy()
  })

  it('should copy to clipboard when pressing the button', async () => {
    renderCopyToClipboardButton()
    const button = screen.getByText(wording)

    await act(async () => {
      fireEvent.press(button)
    })

    expect(Clipboard.setString).toHaveBeenCalledWith(textToCopy)
  })

  it('should show success snack bar if text is copied', async () => {
    renderCopyToClipboardButton()
    const button = screen.getByText(wording)

    Clipboard.getString = jest.fn().mockReturnValue(textToCopy)

    await act(async () => {
      fireEvent.press(button)
    })

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: successSnackBarMessage,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should show error snack bar if text has not been copied', async () => {
    renderCopyToClipboardButton()
    const button = screen.getByText(wording)

    Clipboard.getString = jest.fn().mockReturnValue('text')

    await act(async () => {
      fireEvent.press(button)
    })

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: errorSnackBarMessage,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })
})

function renderCopyToClipboardButton() {
  return render(
    <CopyToClipboardButton
      wording={wording}
      textToCopy={textToCopy}
      snackBarMessage={successSnackBarMessage}
    />
  )
}
