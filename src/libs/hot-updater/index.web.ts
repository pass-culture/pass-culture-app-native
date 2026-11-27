import type { ComponentType } from 'react'

export const HotUpdater = {
  wrap:
    () =>
    <P>(WrappedComponent: ComponentType<P>) =>
      WrappedComponent,
  reload: () => Promise.resolve(),
  getBundleId: () => null as string | null,
  getChannel: () => '',
  getAppVersion: () => '',
  getFingerprintHash: () => null as string | null,
  isChannelSwitched: () => false,
  resetChannel: () => Promise.resolve(false),
  checkForUpdate: () => Promise.resolve(null),
}
