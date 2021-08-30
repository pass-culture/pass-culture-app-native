import { ReactNode } from 'react'

const getUpdateMetadata = jest.fn(() =>
  Promise.resolve({ label: 'label', description: 'decription' })
)
const sync = jest.fn()
const InstallMode = {
  IMMEDIATE: 0,
}
const SyncStatus = {
  UP_TO_DATE: 'UP_TO_DATE',
  UPDATE_INSTALLED: 'UPDATE_INSTALLED',
  UPDATE_IGNORED: 'UPDATE_IGNORED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SYNC_IN_PROGRESS: 'SYNC_IN_PROGRESS',
  CHECKING_FOR_UPDATE: 'CHECKING_FOR_UPDATE',
  AWAITING_USER_ACTION: 'AWAITING_USER_ACTION',
  DOWNLOADING_PACKAGE: 'DOWNLOADING_PACKAGE',
  INSTALLING_UPDATE: 'INSTALLING_UPDATE',
}
const CheckFrequency = { MANUAL: 'MANUAL' }

const CodePush = jest.fn(() => (app: ReactNode) => app)

export default Object.assign(CodePush, {
  getUpdateMetadata,
  sync,
  InstallMode,
  SyncStatus,
  CheckFrequency,
  CodePush,
})
