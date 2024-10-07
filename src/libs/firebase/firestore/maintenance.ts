import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreDocuments,
  RemoteStoreMaintenance,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

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

type OnMaintenanceChange = (maintenance: Maintenance) => void

type Unsubscribe = () => void

export const maintenanceStatusListener = (onMaintenanceChange: OnMaintenanceChange): Unsubscribe =>
  firestoreRemoteStore
    .collection(FIRESTORE_ROOT_COLLECTION)
    .doc(RemoteStoreDocuments.MAINTENANCE)
    .onSnapshot(
      (docSnapshot) => {
        const data = docSnapshot.data()

        const maintenanceIsOn = data?.[RemoteStoreMaintenance.MAINTENANCE_IS_ON]
        const rawMessage = data?.[RemoteStoreMaintenance.MAINTENANCE_MESSAGE]

        if (typeof maintenanceIsOn !== 'boolean') return

        const message =
          typeof rawMessage === 'string'
            ? rawMessage
            : 'L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement\u00a0!'

        const maintenance: Maintenance = maintenanceIsOn
          ? {
              status: MAINTENANCE.ON,
              message,
            }
          : {
              status: MAINTENANCE.OFF,
              message: undefined,
            }

        onMaintenanceChange(maintenance)
      },
      (error) => {
        captureMonitoringError(error.message, 'firestore_not_available')
      }
    )
