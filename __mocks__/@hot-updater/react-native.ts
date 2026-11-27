import { ReactNode } from 'react'

const getUpdateSource = jest.fn(() => Promise.resolve({ source: 'source' }))

const HotUpdater = {
  wrap: jest.fn(() => (app: ReactNode) => app),
  checkForUpdate: jest.fn(),
  getBundleId: jest.fn(() => undefined),
  getChannel: jest.fn(() => 'production'),
  getDefaultChannel: jest.fn(() => 'production'),
  getAppVersion: jest.fn(() => '1.0.0'),
  getFingerprintHash: jest.fn(() => null),
  isChannelSwitched: jest.fn(() => false),
  reload: jest.fn(),
  resetChannel: jest.fn(() => Promise.resolve(true)),
  updateBundle: jest.fn(),
  runUpdateProcess: jest.fn(),
}

export { HotUpdater, getUpdateSource }
export default HotUpdater
