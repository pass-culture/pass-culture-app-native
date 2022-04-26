export enum RemoteStoreCollections {
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

export enum MAINTENANCE {
  UNKNOWN = 'UNKNOWN',
  OFF = 'OFF',
  ON = 'ON',
}

export type Maintenance =
  | {
      status: MAINTENANCE.UNKNOWN
      message: undefined
    }
  | {
      status: MAINTENANCE.OFF
      message: undefined
    }
  | {
      status: MAINTENANCE.ON
      message: string
    }

export type OnMaintenanceChange = (maintenance: Maintenance) => void

export type Unsubscribe = () => void
