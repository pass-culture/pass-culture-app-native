import { useEffect, useState } from 'react'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

import { build } from '../../../../../package.json'

const getDisableStoreReview = (): Promise<void | { minimalBuildNumber: number } | null> =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.FEATURE_FLAGS)
    .doc(env.ENV)
    .get()
    .then((docSnapshot) => {
      const disableStoreReview = docSnapshot.get<{ minimalBuildNumber: number }>(
        RemoteStoreDocuments.WIP_DISABLE_STORE_REVIEW
      )

      if (disableStoreReview === undefined) return null
      return disableStoreReview
    })
    .catch((error) => {
      captureMonitoringError(error.message, 'firestore_not_available')
    })

// firestore feature flag documentation :
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useDisableStoreReview = () => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number>()

  useEffect(() => {
    async function getMinimalBuildNumber() {
      const disableStoreReview = await getDisableStoreReview()
      setMinimalBuildNumber(disableStoreReview?.minimalBuildNumber)
    }
    getMinimalBuildNumber()
  }, [])

  return !!minimalBuildNumber && build >= minimalBuildNumber
}
