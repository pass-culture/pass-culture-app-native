export enum RemoteStoreCollections {
  // TODO(antoinewg): delete this once we have no more application using it
  APP_SEARCH = 'appsearch',
  MAINTENANCE = 'maintenance',
  APPLICATION_VERSIONS = 'applicationVersions',
  APPLICATION_VERSIONS_WEB = 'applicationVersionsWeb',
  UBBLE = 'ubble',
}

export enum RemoteStoreDocuments {
  LOAD_PERCENT = 'load_percent',
  MAINTENANCE_IS_ON = 'maintenanceIsOn',
  MINIMAL_BUILD_NUMBER = 'minimalBuildNumber',
  MINIMAL_BUILD_NUMBER_WEB = 'minimalBuildNumberWeb',
}
