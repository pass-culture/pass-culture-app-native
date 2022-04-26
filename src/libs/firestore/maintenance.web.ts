import { t } from '@lingui/macro'
// eslint-disable-next-line no-restricted-imports
import { collection, doc, onSnapshot } from 'firebase/firestore'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firestore/client.web'
import {
  Maintenance,
  MAINTENANCE,
  OnMaintenanceChange,
  RemoteStoreCollections,
  RemoteStoreDocuments,
  Unsubscribe,
} from 'libs/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const maintenanceStatusListener = (onMaintenanceChange: OnMaintenanceChange): Unsubscribe =>
  onSnapshot(
    doc(collection(firestoreRemoteStore, RemoteStoreCollections.MAINTENANCE), env.ENV),
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
