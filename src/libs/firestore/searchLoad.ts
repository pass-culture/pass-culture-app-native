import { useEffect, useState } from 'react'

import { env } from 'libs/environment'
import firestoreRemoteStore from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'

export const getSearchLoad = () =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.APP_SEARCH)
    .doc(env.ENV)
    .get()
    .then((collection) => collection.data())

export const useSearchLoad = () => {
  const [searchLoad, setSearchLoad] = useState<number>(0)

  useEffect(() => {
    getSearchLoad().then((data) => {
      if (data && typeof data[RemoteStoreDocuments.LOAD_PERCENT] === 'number')
        setSearchLoad(data[RemoteStoreDocuments.LOAD_PERCENT])
    })
  }, [])

  return searchLoad
}
