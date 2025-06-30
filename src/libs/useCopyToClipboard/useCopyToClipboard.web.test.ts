import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { renderHook } from 'tests/utils/web'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
const writeTextMock = jest.fn()
const onCopyMock = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: mockShowSuccessSnackBar,
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

Object.assign(navigator, { clipboard: { writeText: writeTextMock } })

const successSnackBarMessage = 'Copié avec succès\u00a0!'
const errorSnackBarMessage = 'Une erreur est survenue, veuillez réessayer.'
const textToCopy = 'Texte à copier'

describe('useCopyToClipboard', () => {
  it('should copy to clipboard on trigger', async () => {
    const { result } = renderUseCopyToClipboard()
    await result.current()

    expect(writeTextMock).toHaveBeenCalledWith(textToCopy)
  })

  it('should call onCopy on trigger', async () => {
    const { result } = renderUseCopyToClipboard()
    await result.current()

    expect(onCopyMock).toHaveBeenCalledTimes(1)
  })

  it('should show success snack bar when text is copied', async () => {
    const { result } = renderUseCopyToClipboard()
    await result.current()

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: successSnackBarMessage,
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should show error snack bar when text could not be copied', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('error'))
    const { result } = renderUseCopyToClipboard()
    await result.current()

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
