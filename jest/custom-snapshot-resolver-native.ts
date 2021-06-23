const NATIVE_SNAPSHOT_EXTENSION = '.native-snap'

export default {
  /** resolves from test to snapshot path */
  resolveSnapshotPath: (testPath: string) => {
    return `${testPath.replace('src/', '__snapshots__/')}${NATIVE_SNAPSHOT_EXTENSION}`
  },

  /** resolves from snapshot to test path */
  resolveTestPath: (snapshotFilePath: string) => {
    return snapshotFilePath
      .replace('__snapshots__/', 'src/')
      .slice(0, -NATIVE_SNAPSHOT_EXTENSION.length)
  },
  testPathForConsistencyCheck: '',
}
