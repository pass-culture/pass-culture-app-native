import { HotUpdater } from '@hot-updater/react-native'

import { handlePreviewInstallFromDeeplink } from 'features/preview/handlePreviewInstallFromDeeplink'
import * as loadPreviewChannelModule from 'features/preview/loadPreviewChannel'
import { clearPreviewInstall, getPreviewInstall } from 'features/preview/previewInstallStorage'

jest.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    getFingerprintHash: jest.fn(),
  },
}))

jest.mock('features/preview/loadPreviewChannel', () => ({
  loadPreviewChannel: jest.fn(),
}))

const mockGetFingerprintHash = HotUpdater.getFingerprintHash as jest.Mock
const mockLoadPreviewChannel = loadPreviewChannelModule.loadPreviewChannel as jest.Mock

describe('handlePreviewInstallFromDeeplink', () => {
  beforeEach(async () => {
    await clearPreviewInstall()
    mockGetFingerprintHash.mockReset()
    mockLoadPreviewChannel.mockReset()
  })

  it('should return mismatch and not persist when channel or fingerprint is missing', async () => {
    const result = await handlePreviewInstallFromDeeplink({
      downloadUrl: 'https://example.com',
    })

    expect(result).toBe('mismatch')
    expect(await getPreviewInstall()).toBeNull()
    expect(mockLoadPreviewChannel).not.toHaveBeenCalled()
  })

  it('should persist and return mismatch when fingerprint does not match', async () => {
    mockGetFingerprintHash.mockReturnValueOnce('device-fp')

    const result = await handlePreviewInstallFromDeeplink({
      channel: 'PC-1234',
      fingerprint: 'qr-fp',
      downloadUrl: 'https://example.com/download',
    })

    expect(result).toBe('mismatch')
    expect(await getPreviewInstall()).toEqual({
      channel: 'PC-1234',
      fingerprint: 'qr-fp',
      downloadUrl: 'https://example.com/download',
    })
    expect(mockLoadPreviewChannel).not.toHaveBeenCalled()
  })

  it('should persist, load channel and return matched when fingerprint matches', async () => {
    mockGetFingerprintHash.mockReturnValueOnce('same-fp')

    const result = await handlePreviewInstallFromDeeplink({
      channel: 'PC-1234',
      fingerprint: 'same-fp',
      downloadUrl: 'https://example.com/download',
    })

    expect(result).toBe('matched')
    expect(await getPreviewInstall()).toEqual({
      channel: 'PC-1234',
      fingerprint: 'same-fp',
      downloadUrl: 'https://example.com/download',
    })
    expect(mockLoadPreviewChannel).toHaveBeenCalledWith('PC-1234')
  })
})
