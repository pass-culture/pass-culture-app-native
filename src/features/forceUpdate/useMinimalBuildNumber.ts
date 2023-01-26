import { useEffect, useState } from 'react'

import { minimalBuildNumberStatusListener } from 'libs/firebase/firestore/applicationVersions'

export const useMinimalBuildNumber = () => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number | null>(null)

  useEffect(() => {
    const subscriber = minimalBuildNumberStatusListener(setMinimalBuildNumber)

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])

  return minimalBuildNumber
}
