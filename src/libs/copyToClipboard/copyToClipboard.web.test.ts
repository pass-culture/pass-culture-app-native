import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

const mockShowSuccessSnackBar = jest.spyOn(snackBarStoreModule, 'showSuccessSnackBar')
const mockShowErrorSnackBar = jest.spyOn(snackBarStoreModule, 'showErrorSnackBar')

const writeTextMock = jest.fn()
const onCopyMock = jest.fn()

Object.assign(navigator, { clipboard: { writeText: writeTextMock } })

const successSnackBarMessage = 'Copié avec succès\u00a0!'
const errorSnackBarMessage = 'Une erreur est survenue, veuillez réessayer.'
const textToCopy = 'Texte à copier'

describe('copyToClipboard', () => {
  it('should copy to clipboard on trigger', async () => {
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(writeTextMock).toHaveBeenCalledWith(textToCopy)
  })

  it('should call onCopy on trigger', async () => {
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(onCopyMock).toHaveBeenCalledTimes(1)
  })

  it('should show success snack bar when text is copied', async () => {
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith(successSnackBarMessage)
  })

  it('should show error snack bar when text could not be copied', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('error'))
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith(errorSnackBarMessage)
  })
})
