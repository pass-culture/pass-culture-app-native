import { firestoreRemoteStore, doc, getDoc } from 'libs/firebase/firestore/client'
import {
  getHardBuildDocId,
  HARD_BUILDS_COLLECTION,
  HardBuild,
  HardBuildPlatform,
} from 'libs/firebase/firestore/hardBuilds/types'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

/**
 * Reads a native hard build registered by the POC fingerprint CI.
 * Requires Firestore rules allowing client read on collection `hardBuilds`
 * in project pc-native-testing (write stays CI service-account only).
 */
export const getHardBuildByFingerprint = async ({
  platform,
  fingerprint,
}: {
  platform: HardBuildPlatform
  fingerprint: string
}): Promise<HardBuild | null> => {
  try {
    const docRef = doc(
      firestoreRemoteStore,
      HARD_BUILDS_COLLECTION,
      getHardBuildDocId(platform, fingerprint)
    )
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists) {
      return null
    }

    const data = snapshot.data()
    if (!data?.testingUri || typeof data.testingUri !== 'string') {
      return null
    }

    return {
      fingerprint: String(data.fingerprint ?? fingerprint),
      platform: (data.platform as HardBuildPlatform) ?? platform,
      env: String(data.env ?? ''),
      version: data.version != null ? String(data.version) : null,
      buildNumber: typeof data.buildNumber === 'number' ? data.buildNumber : null,
      testingUri: data.testingUri,
      firebaseConsoleUri:
        data.firebaseConsoleUri != null ? String(data.firebaseConsoleUri) : null,
    }
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_hard_builds_not_available')
    return null
  }
}
