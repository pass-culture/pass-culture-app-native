import { t } from '@lingui/macro'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'
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
    .collection(RemoteStoreCollections.MAINTENANCE)
    .doc(env.ENV)
    .onSnapshot(
      (docSnapshot) => {
        const data = docSnapshot.data()

        const maintenanceIsOn = data?.[RemoteStoreDocuments.MAINTENANCE_IS_ON]
        const rawMessage = data?.[RemoteStoreDocuments.MAINTENANCE_MESSAGE]

        if (typeof maintenanceIsOn !== 'boolean') return

        const message =
          typeof rawMessage === 'string'
            ? rawMessage
            : t`L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement\u00a0!`

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
