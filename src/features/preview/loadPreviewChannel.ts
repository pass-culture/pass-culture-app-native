import { HotUpdater } from '@hot-updater/react-native'

export const loadPreviewChannel = async (channel: string) => {
  if (HotUpdater.isChannelSwitched() && HotUpdater.getChannel() !== channel) {
    await HotUpdater.resetChannel()
  }

  const updateInfo = await HotUpdater.checkForUpdate({
    channel,
    updateStrategy: 'fingerprint',
  })
  if (!updateInfo) return

  if (await updateInfo.updateBundle()) {
    await HotUpdater.reload()
  }
}
