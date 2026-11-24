import * as handlePreviewInstallFromDeeplinkModule from 'features/preview/handlePreviewInstallFromDeeplink'
import { resolvePreviewInstallForModal } from 'features/preview/resolvePreviewInstallForModal'

jest.mock('features/preview/handlePreviewInstallFromDeeplink', () => ({
  handlePreviewInstallFromDeeplink: jest.fn(),
}))

const mockHandlePreviewInstallFromDeeplink =
  handlePreviewInstallFromDeeplinkModule.handlePreviewInstallFromDeeplink as jest.Mock

describe('resolvePreviewInstallForModal', () => {
  const onReloaded = jest.fn()
  const onMismatch = jest.fn()
  const onReport = jest.fn()

  beforeEach(() => {
    onReloaded.mockReset()
    onMismatch.mockReset()
    onReport.mockReset()
    mockHandlePreviewInstallFromDeeplink.mockReset()
  })

  it('should close the deeplink when the bundle reloads', async () => {
    mockHandlePreviewInstallFromDeeplink.mockResolvedValueOnce({ status: 'reloaded' })

    await resolvePreviewInstallForModal({
      channel: 'PC-1234',
      fingerprint: 'same-fp',
      downloadUrl: 'https://example.com',
      onReloaded,
      onMismatch,
      onReport,
    })

    expect(onReloaded).toHaveBeenCalledTimes(1)
    expect(onMismatch).not.toHaveBeenCalled()
    expect(onReport).not.toHaveBeenCalled()
  })

  it('should keep the failure on screen when no bundle is downloaded', async () => {
    mockHandlePreviewInstallFromDeeplink.mockResolvedValueOnce({
      status: 'up_to_date',
      detail: 'Aucun bundle téléchargé',
    })

    await resolvePreviewInstallForModal({
      channel: 'PC-1234',
      fingerprint: 'same-fp',
      onReloaded,
      onMismatch,
      onReport,
    })

    expect(onReport).toHaveBeenCalledWith('Aucun bundle téléchargé')
    expect(onReloaded).not.toHaveBeenCalled()
    expect(onMismatch).not.toHaveBeenCalled()
  })

  it('should show download UI when fingerprint mismatches', async () => {
    mockHandlePreviewInstallFromDeeplink.mockResolvedValueOnce({ status: 'mismatch' })

    await resolvePreviewInstallForModal({
      channel: 'PC-1234',
      fingerprint: 'other-fp',
      downloadUrl: 'https://example.com',
      onReloaded,
      onMismatch,
      onReport,
    })

    expect(onMismatch).toHaveBeenCalledTimes(1)
    expect(onReloaded).not.toHaveBeenCalled()
    expect(onReport).not.toHaveBeenCalled()
  })
})
