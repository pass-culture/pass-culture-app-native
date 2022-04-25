// eslint-disable-next-line no-restricted-imports
import { collection, doc, getDoc } from 'firebase/firestore'
import { useQuery } from 'react-query'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebaseImpl/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firebaseImpl/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

// To avoid firing requests firestore on every request
const STALE_TIME_FIRESTORE_UBBLE_ETA_MESSAGE = 5 * 60 * 1000
const defaultUbbleETAMessage = 'Environ 3 heures'

export const getUbbleETAMessage = async () => {
  const docRef = doc(collection(firestoreRemoteStore, RemoteStoreCollections.UBBLE), env.ENV)
  const docSnapshot = await getDoc(docRef)

  if (docSnapshot.exists()) {
    const data = docSnapshot.data()
    const ubbleETAMessage = data[RemoteStoreDocuments.UBBLE_ETA_MESSAGE]

    return typeof ubbleETAMessage === 'string' && !!ubbleETAMessage
      ? ubbleETAMessage
      : defaultUbbleETAMessage
  } else {
    return defaultUbbleETAMessage
  }
}

export const useUbbleETAMessage = () => {
  return useQuery<string>(QueryKeys.FIRESTORE_UBBLE_ETA_MESSAGE, () => getUbbleETAMessage(), {
    staleTime: STALE_TIME_FIRESTORE_UBBLE_ETA_MESSAGE,
  })
}
