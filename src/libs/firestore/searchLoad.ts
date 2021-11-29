import { useQuery } from 'react-query'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

// To avoid firing requests firestore on every request
const STALE_TIME_FIRESTORE_SEARCH_LOAD = 5 * 60 * 1000

// TODO(antoinewg): RemoteStoreDocuments.LOAD_PERCENT is not used anymore
// However, we can reuse this code for sending to ubble based on firestore param.
export const getSearchLoad = () =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.APP_SEARCH)
    .doc(env.ENV)
    .get()
    .then((collection) => collection.data())
    .then((data) =>
      data && typeof data[RemoteStoreDocuments.LOAD_PERCENT] === 'number'
        ? data[RemoteStoreDocuments.LOAD_PERCENT]
        : 0
    )

export const useSearchLoad = () =>
  useQuery<number>(QueryKeys.FIRESTORE_APP_SEARCH, getSearchLoad, {
    staleTime: STALE_TIME_FIRESTORE_SEARCH_LOAD,
  })
