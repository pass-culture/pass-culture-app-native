import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreDocuments,
  RemoteStoreExchangeRates,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getExchangeRates = async (): Promise<number> => {
  try {
    const docSnapshot = await firestoreRemoteStore
      .collection(FIRESTORE_ROOT_COLLECTION)
      .doc(RemoteStoreDocuments.EXCHANGE_RATES)
      .get()

    if (!docSnapshot.exists) return DEFAULT_PACIFIC_FRANC_TO_EURO_RATE

    return docSnapshot.get<number>(RemoteStoreExchangeRates.PACIFIC_FRANC_TO_EURO_RATE)
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
  }
}
