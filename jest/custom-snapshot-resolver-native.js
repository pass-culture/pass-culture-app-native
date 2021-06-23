const NATIVE_SNAPSHOT_EXTENSION = '.native-snap'

module.exports = {
  /** resolves from test to snapshot path */
  resolveSnapshotPath: (testPath) => {
    return `${testPath.replace('src/', '__snapshots__/')}${NATIVE_SNAPSHOT_EXTENSION}`
  },

  /** resolves from snapshot to test path */
  resolveTestPath: (snapshotFilePath) => {
    return snapshotFilePath
      .replace('__snapshots__/', 'src/')
      .slice(0, -NATIVE_SNAPSHOT_EXTENSION.length)
  },
  testPathForConsistencyCheck: '',
}
