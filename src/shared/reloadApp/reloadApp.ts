import { HotUpdater } from '@hot-updater/react-native'

export const reloadApp = (): void => {
  void HotUpdater.reload()
}
