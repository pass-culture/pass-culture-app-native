import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreDocuments,
  RemoteStoreExchangeRates,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const getExchangeRates = async (): Promise<number | null> => {
  try {
    const docSnapshot = await firestoreRemoteStore
      .collection(FIRESTORE_ROOT_COLLECTION)
      .doc(RemoteStoreDocuments.EXCHANGE_RATES)
      .get()

    return docSnapshot.get<number>(RemoteStoreExchangeRates.PACIFIC_FRANC_TO_EURO_RATE)
  } catch (error) {
    captureMonitoringError((error as Error).message, 'firestore_not_available')
    return null
  }
}
