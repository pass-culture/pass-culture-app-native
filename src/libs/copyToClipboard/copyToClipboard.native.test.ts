import clipboard from '__mocks__/@react-native-clipboard/clipboard'
import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

jest.mock('@react-native-clipboard/clipboard')

const mockShowSuccessSnackBar = jest.spyOn(snackBarStoreModule, 'showSuccessSnackBar')
const mockShowErrorSnackBar = jest.spyOn(snackBarStoreModule, 'showErrorSnackBar')

const onCopyMock = jest.fn()

const successSnackBarMessage = 'Copié avec succès\u00a0!'
const errorSnackBarMessage = 'Une erreur est survenue, veuillez réessayer.'
const textToCopy = 'Texte à copier'

describe('copyToClipboard', () => {
  it('should copy to clipboard when pressing the button', async () => {
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(clipboard.setString).toHaveBeenCalledWith(textToCopy)
  })

  it('should call onCopy when text is copied', async () => {
    clipboard.getString.mockResolvedValueOnce(textToCopy)
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(onCopyMock).toHaveBeenCalledTimes(1)
  })

  it('should show success snack bar with default text when no snackBarMessage is given', async () => {
    clipboard.getString.mockResolvedValueOnce(textToCopy)
    await copyToClipboard({ textToCopy })

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith('Copié\u00a0!')
  })

  it('should show success snack bar when text is copied', async () => {
    clipboard.getString.mockResolvedValueOnce(textToCopy)
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith(successSnackBarMessage)
  })

  it('should show error snack bar if text has not been copied', async () => {
    clipboard.getString.mockResolvedValueOnce('Different text')
    await copyToClipboard({
      textToCopy,
      snackBarMessage: successSnackBarMessage,
      onCopy: onCopyMock,
    })

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith(errorSnackBarMessage)
  })
})
