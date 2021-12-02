import { useQuery } from 'react-query'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

// To avoid firing requests firestore on every request
const STALE_TIME_FIRESTORE_UBBLE_LOAD = 5 * 60 * 1000

export const getUbbleLoad = () =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.UBBLE)
    .doc(env.ENV)
    .get()
    .then((collection) => collection.data())
    .then((data) =>
      data && typeof data[RemoteStoreDocuments.LOAD_PERCENT] === 'number'
        ? data[RemoteStoreDocuments.LOAD_PERCENT]
        : 0
    )

export const useUbbleLoad = () =>
  useQuery<number>(QueryKeys.FIRESTORE_UBBLE_LOAD, () => getUbbleLoad(), {
    staleTime: STALE_TIME_FIRESTORE_UBBLE_LOAD,
  })

export const useSendToUbble = () => {
  const { data: ubbleLoad = 0 } = useUbbleLoad()
  return isBelowLoad(ubbleLoad)
}

/**
 * @param load number between 0 and 100, configured in firestore
 */
const isBelowLoad = (load: number): boolean => {
  const randomLoad = Math.random() * 100
  return randomLoad < load
}
