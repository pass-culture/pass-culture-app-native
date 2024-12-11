import { useQuery } from 'react-query'

import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreDocuments,
  RemoteStoreUbble,
} from 'libs/firebase/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

// To avoid firing requests firestore on every request
const STALE_TIME_FIRESTORE_UBBLE_ETA_MESSAGE = 5 * 60 * 1000
const defaultUbbleETAMessage = 'Environ 3 heures'

export const getUbbleETAMessage = () =>
  firestoreRemoteStore
    .collection(FIRESTORE_ROOT_COLLECTION)
    .doc(RemoteStoreDocuments.UBBLE)
    .get()
    .then((collection) => collection.data())
    .then((data) =>
      data &&
      typeof data[RemoteStoreUbble.UBBLE_ETA_MESSAGE] === 'string' &&
      !!data[RemoteStoreUbble.UBBLE_ETA_MESSAGE]
        ? data[RemoteStoreUbble.UBBLE_ETA_MESSAGE]
        : defaultUbbleETAMessage
    )

export const useUbbleETAMessage = () => {
  return useQuery<string>(QueryKeys.FIRESTORE_UBBLE_ETA_MESSAGE, () => getUbbleETAMessage(), {
    staleTime: STALE_TIME_FIRESTORE_UBBLE_ETA_MESSAGE,
  })
}
