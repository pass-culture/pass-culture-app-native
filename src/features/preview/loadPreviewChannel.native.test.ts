import { HotUpdater } from '@hot-updater/react-native'

import { loadPreviewChannel } from 'features/preview/loadPreviewChannel'

jest.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    checkForUpdate: jest.fn(),
    getBundleId: jest.fn(() => 'bundle-1'),
    getChannel: jest.fn(() => 'production'),
    getFingerprintHash: jest.fn(() => 'fp-device'),
    isChannelSwitched: jest.fn(() => false),
    reload: jest.fn(),
    resetChannel: jest.fn(() => Promise.resolve(true)),
  },
}))

const mockCheckForUpdate = HotUpdater.checkForUpdate as jest.Mock
const mockIsChannelSwitched = HotUpdater.isChannelSwitched as jest.Mock
const mockGetChannel = HotUpdater.getChannel as jest.Mock
const mockResetChannel = HotUpdater.resetChannel as jest.Mock
const mockReload = HotUpdater.reload as jest.Mock

describe('loadPreviewChannel', () => {
  beforeEach(() => {
    mockCheckForUpdate.mockReset()
    mockIsChannelSwitched.mockReset()
    mockIsChannelSwitched.mockReturnValue(false)
    mockGetChannel.mockReset()
    mockGetChannel.mockReturnValue('production')
    mockResetChannel.mockClear()
    mockReload.mockClear()
  })

  it('should report that nothing was downloaded when the check returns null', async () => {
    mockCheckForUpdate.mockResolvedValueOnce(null)

    const result = await loadPreviewChannel('PC-1234')

    expect(mockCheckForUpdate).toHaveBeenCalledWith({
      channel: 'PC-1234',
      updateStrategy: 'fingerprint',
      requestTimeout: 20_000,
      onError: expect.any(Function),
    })
    expect(result).toEqual({
      status: 'up_to_date',
      detail: expect.stringMatching(/Aucun bundle téléchargé[\s\S]*fingerprint fp-device/),
    })
  })

  it('should reset channel when already switched to another channel', async () => {
    mockIsChannelSwitched.mockReturnValueOnce(true)
    mockGetChannel.mockReturnValueOnce('PC-OLD')
    mockCheckForUpdate.mockResolvedValueOnce(null)

    await loadPreviewChannel('PC-1234')

    expect(mockResetChannel).toHaveBeenCalledTimes(1)
    expect(mockCheckForUpdate).toHaveBeenCalledWith({
      channel: 'PC-1234',
      updateStrategy: 'fingerprint',
      requestTimeout: 20_000,
      onError: expect.any(Function),
    })
  })

  it('should update bundle and reload when an update is available', async () => {
    const updateBundle = jest.fn().mockResolvedValue(true)
    mockCheckForUpdate.mockResolvedValueOnce({ updateBundle })

    await expect(loadPreviewChannel('PC-1234')).resolves.toEqual({ status: 'reloaded' })

    expect(updateBundle).toHaveBeenCalledTimes(1)
    expect(mockReload).toHaveBeenCalledTimes(1)
  })

  it('should not reload when updateBundle fails', async () => {
    const updateBundle = jest.fn().mockResolvedValue(false)
    mockCheckForUpdate.mockResolvedValueOnce({ updateBundle })

    const result = await loadPreviewChannel('PC-1234')

    expect(updateBundle).toHaveBeenCalledTimes(1)
    expect(mockReload).not.toHaveBeenCalled()
    expect(result.status).toBe('download_failed')
  })

  it('should surface the check error instead of looking successful', async () => {
    mockCheckForUpdate.mockImplementationOnce(({ onError }) => {
      onError(new Error('Request timed out'))
      return null
    })

    const result = await loadPreviewChannel('PC-1234')

    expect(result).toEqual({
      status: 'error',
      detail: expect.stringContaining('Request timed out'),
    })

    expect(mockReload).not.toHaveBeenCalled()
  })
})
