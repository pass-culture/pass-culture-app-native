import { useEffect, useState } from 'react'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

import { build } from '../../../../../package.json'

const getNewIdentificationFlow = (): Promise<void | { minimalBuildNumber: number } | null> =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.FEATURE_FLAGS)
    .doc(env.ENV)
    .get()
    .then((docSnapshot) => {
      const newIdentificationFlow = docSnapshot.get<{ minimalBuildNumber: number }>(
        RemoteStoreDocuments.NEW_IDENTIFICATION_FLOW
      )

      if (newIdentificationFlow === undefined) return null
      return newIdentificationFlow
    })
    .catch((error) => {
      captureMonitoringError(error.message, 'firestore_not_available')
    })

// firestore feature flag documentation :
// https://www.notion.so/passcultureapp/Feature-Flag-e7b0da7946f64020b8403e3581b4ed42#fff5fb17737240c9996c432117acacd8
export const useEnableNewIdentificationFlow = () => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number>()

  useEffect(() => {
    async function getMinimalBuildNumber() {
      const newIdentificationFlow = await getNewIdentificationFlow()
      setMinimalBuildNumber(newIdentificationFlow?.minimalBuildNumber)
    }
    getMinimalBuildNumber()
  }, [])

  return !!minimalBuildNumber && build >= minimalBuildNumber
}
