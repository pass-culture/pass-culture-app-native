import clipboard from '__mocks__/@react-native-clipboard/clipboard'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { renderHook } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

jest.mock('@react-native-clipboard/clipboard')

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
const onCopyMock = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

const successSnackBarMessage = 'Copié avec succès\u00a0!'
const errorSnackBarMessage = 'Une erreur est survenue, veuillez réessayer.'
const textToCopy = 'Texte à copier'

describe('CopyToClipboardButton', () => {
  it('should copy to clipboard when pressing the button', async () => {
    await renderUseCopyToClipboard().result.current()

    expect(clipboard.setString).toHaveBeenCalledWith(textToCopy)
  })

  it('should call onCopy when text is copied', async () => {
    clipboard.getString.mockResolvedValueOnce(textToCopy)
    await renderUseCopyToClipboard().result.current()

    expect(onCopyMock).toHaveBeenCalledTimes(1)
  })

  it('should show success snack bar when text is copied', async () => {
    clipboard.getString.mockResolvedValueOnce(textToCopy)
    await renderUseCopyToClipboard().result.current()

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: successSnackBarMessage,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should show error snack bar if text has not been copied', async () => {
    clipboard.getString.mockResolvedValueOnce('Different text')
    await renderUseCopyToClipboard().result.current()

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: errorSnackBarMessage,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })
})

function renderUseCopyToClipboard() {
  return renderHook(() =>
    useCopyToClipboard({ textToCopy, snackBarMessage: successSnackBarMessage, onCopy: onCopyMock })
  )
}
