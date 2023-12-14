import React from 'react'

import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockCopyToClipboard = jest.fn()
jest.mock('libs/useCopyToClipboard/useCopyToClipboard', () => ({
  useCopyToClipboard: () => mockCopyToClipboard,
}))

const successSnackBarMessage = 'Copié avec succès\u00a0!'
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

    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1)
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
