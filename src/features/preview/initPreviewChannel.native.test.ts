import { HotUpdater } from '@hot-updater/react-native'

import { initPreviewChannel } from 'features/preview/initPreviewChannel'
import * as loadPreviewChannelModule from 'features/preview/loadPreviewChannel'
import { clearPreviewInstall, savePreviewInstall } from 'features/preview/previewInstallStorage'

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

describe('initPreviewChannel', () => {
  beforeEach(async () => {
    await clearPreviewInstall()
    mockGetFingerprintHash.mockReset()
    mockLoadPreviewChannel.mockReset()
  })

  it('should do nothing when nothing is persisted', async () => {
    await initPreviewChannel()

    expect(mockLoadPreviewChannel).not.toHaveBeenCalled()
  })

  it('should do nothing when fingerprint does not match', async () => {
    await savePreviewInstall({
      channel: 'PC-1234',
      fingerprint: 'expected',
      downloadUrl: null,
    })
    mockGetFingerprintHash.mockReturnValueOnce('other')

    await initPreviewChannel()

    expect(mockLoadPreviewChannel).not.toHaveBeenCalled()
  })

  it('should load channel when fingerprint matches', async () => {
    await savePreviewInstall({
      channel: 'PC-1234',
      fingerprint: 'expected',
      downloadUrl: null,
    })
    mockGetFingerprintHash.mockReturnValueOnce('expected')

    await initPreviewChannel()

    expect(mockLoadPreviewChannel).toHaveBeenCalledWith('PC-1234')
  })
})
