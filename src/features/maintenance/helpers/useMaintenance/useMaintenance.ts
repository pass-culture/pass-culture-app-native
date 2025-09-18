import { onlineManager, useQuery } from '@tanstack/react-query'

import { getMaintenance } from 'libs/firebase/firestore/getMaintenance/getMaintenance'
import { MAINTENANCE, Maintenance, RemoteStoreMaintenance } from 'libs/firebase/firestore/types'
import { FirebaseFirestoreTypes } from 'libs/firebase/shims/firestore'
import { QueryKeys } from 'libs/queryKeys'

const UNKNOWN_MAINTENANCE: Maintenance = { status: MAINTENANCE.UNKNOWN, message: undefined }

export const useMaintenance = (): Maintenance => {
  const { data } = useQuery({
    queryKey: [QueryKeys.MAINTENANCE],
    queryFn: getMaintenance,
    staleTime: 1000 * 30,
    gcTime: 1000 * 30,
    enabled: onlineManager.isOnline(),
    select: (data: FirebaseFirestoreTypes.DocumentData) => {
      const maintenanceIsOn = data?.[RemoteStoreMaintenance.MAINTENANCE_IS_ON]
      const rawMessage = data?.[RemoteStoreMaintenance.MAINTENANCE_MESSAGE]

      if (typeof maintenanceIsOn !== 'boolean') return UNKNOWN_MAINTENANCE

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

      return maintenance
    },
  })

  return data ?? UNKNOWN_MAINTENANCE
}
