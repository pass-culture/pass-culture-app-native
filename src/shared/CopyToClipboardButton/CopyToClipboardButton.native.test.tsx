import React from 'react'

import * as copyToClipboardModule from 'libs/copyToClipboard/copyToClipboard'
import { CopyToClipboardButton } from 'shared/CopyToClipboardButton/CopyToClipboardButton'
import { userEvent, render, screen } from 'tests/utils'

const mockCopyToClipboard = jest.spyOn(copyToClipboardModule, 'copyToClipboard')

const successSnackBarMessage = 'Copié avec succès\u00a0!'
const wording = 'Copier l’adresse'
const textToCopy = 'Le sucre, 69002 LYON'

const user = userEvent.setup()
jest.useFakeTimers()

describe('CopyToClipboardButton', () => {
  it('should show right text', async () => {
    renderCopyToClipboardButton()

    const button = screen.getByText(wording)

    expect(button).toBeTruthy()
  })

  it('should copy to clipboard when pressing the button', async () => {
    renderCopyToClipboardButton()
    const button = screen.getByText(wording)

    await user.press(button)

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
