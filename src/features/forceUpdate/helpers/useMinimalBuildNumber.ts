import { useEffect, useState } from 'react'
import { onlineManager } from 'react-query'

import { minimalBuildNumberStatusListener } from 'libs/firebase/firestore/applicationVersions'

export const useMinimalBuildNumber = () => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number | null>(null)

  useEffect(() => {
    if (!onlineManager.isOnline()) {
      return
    }

    const subscriber = minimalBuildNumberStatusListener(setMinimalBuildNumber)

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])

  return minimalBuildNumber
}
