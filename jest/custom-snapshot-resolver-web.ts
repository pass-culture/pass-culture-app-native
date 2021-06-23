const WEB_SNAPSHOT_EXTENSION = '.web-snap'

export default {
  /** resolves from test to snapshot path */
  resolveSnapshotPath: (testPath: string) => {
    const WEB_SNAPSHOT_EXTENSION = '.web-snap'
    return `${testPath.replace('src/', '__snapshots__/')}${WEB_SNAPSHOT_EXTENSION}`
  },

  /** resolves from snapshot to test path */
  resolveTestPath: (snapshotFilePath: string) => {
    return snapshotFilePath
      .replace('__snapshots__/', 'src/')
      .slice(0, -WEB_SNAPSHOT_EXTENSION.length)
  },
  testPathForConsistencyCheck: '',
}
