export enum RemoteStoreCollections {
  // TODO(antoinewg): delete this once we have no more application using it
  APP_SEARCH = 'appsearch',
  MAINTENANCE = 'maintenance',
  APPLICATION_VERSIONS = 'applicationVersions',
  UBBLE = 'ubble',
}

export enum RemoteStoreDocuments {
  UBBLE_ETA_MESSAGE = 'etaMessage',
  MAINTENANCE_IS_ON = 'maintenanceIsOn',
  MAINTENANCE_MESSAGE = 'message',
  MINIMAL_BUILD_NUMBER = 'minimalBuildNumber',
}
