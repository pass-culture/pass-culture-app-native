import { HotUpdater } from '@hot-updater/react-native'

import { loadPreviewChannel } from 'features/preview/loadPreviewChannel'

jest.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    checkForUpdate: jest.fn(),
    getChannel: jest.fn(() => 'production'),
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

  it('should check for update with the given channel', async () => {
    mockCheckForUpdate.mockResolvedValueOnce(null)

    await loadPreviewChannel('PC-1234')

    expect(mockCheckForUpdate).toHaveBeenCalledWith({
      channel: 'PC-1234',
      updateStrategy: 'fingerprint',
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
    })
  })

  it('should update bundle and reload when an update is available', async () => {
    const updateBundle = jest.fn().mockResolvedValue(true)
    mockCheckForUpdate.mockResolvedValueOnce({ updateBundle })

    await loadPreviewChannel('PC-1234')

    expect(updateBundle).toHaveBeenCalledTimes(1)
    expect(mockReload).toHaveBeenCalledTimes(1)
  })

  it('should not reload when updateBundle fails', async () => {
    const updateBundle = jest.fn().mockResolvedValue(false)
    mockCheckForUpdate.mockResolvedValueOnce({ updateBundle })

    await loadPreviewChannel('PC-1234')

    expect(updateBundle).toHaveBeenCalledTimes(1)
    expect(mockReload).not.toHaveBeenCalled()
  })
})
