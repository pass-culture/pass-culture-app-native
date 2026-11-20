import * as handlePreviewInstallFromDeeplinkModule from 'features/preview/handlePreviewInstallFromDeeplink'
import {
  getPreviewChannelLoadedMessage,
  resolvePreviewInstallForModal,
} from 'features/preview/resolvePreviewInstallForModal'
import * as snackBarStoreModule from 'ui/designSystem/Snackbar/snackBar.store'

jest.mock('features/preview/handlePreviewInstallFromDeeplink', () => ({
  handlePreviewInstallFromDeeplink: jest.fn(),
}))

const mockHandlePreviewInstallFromDeeplink =
  handlePreviewInstallFromDeeplinkModule.handlePreviewInstallFromDeeplink as jest.Mock
const mockShowSuccessSnackBar = jest.spyOn(snackBarStoreModule, 'showSuccessSnackBar')

describe('resolvePreviewInstallForModal', () => {
  const onMatched = jest.fn()
  const onMismatch = jest.fn()

  beforeEach(() => {
    onMatched.mockReset()
    onMismatch.mockReset()
    mockHandlePreviewInstallFromDeeplink.mockReset()
    mockShowSuccessSnackBar.mockClear()
  })

  it('should show snackbar, close deeplink and not show download when channel matched', async () => {
    mockHandlePreviewInstallFromDeeplink.mockResolvedValueOnce('matched')

    await resolvePreviewInstallForModal({
      channel: 'PC-1234',
      fingerprint: 'same-fp',
      downloadUrl: 'https://example.com',
      onMatched,
      onMismatch,
    })

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith(getPreviewChannelLoadedMessage('PC-1234'))
    expect(onMatched).toHaveBeenCalledTimes(1)
    expect(onMismatch).not.toHaveBeenCalled()
  })

  it('should show download UI without snackbar when fingerprint mismatches', async () => {
    mockHandlePreviewInstallFromDeeplink.mockResolvedValueOnce('mismatch')

    await resolvePreviewInstallForModal({
      channel: 'PC-1234',
      fingerprint: 'other-fp',
      downloadUrl: 'https://example.com',
      onMatched,
      onMismatch,
    })

    expect(mockShowSuccessSnackBar).not.toHaveBeenCalled()
    expect(onMismatch).toHaveBeenCalledTimes(1)
    expect(onMatched).not.toHaveBeenCalled()
  })
})
