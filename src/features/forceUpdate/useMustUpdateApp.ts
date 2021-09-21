import { useEffect, useState } from 'react'

import { minimalBuildNumberStatusListener } from 'libs/firestore/applicationVersions'

import { build } from '../../../package.json'

const useMinimalBuildNumber = () => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number | null>(null)

  useEffect(() => {
    const subscriber = minimalBuildNumberStatusListener(setMinimalBuildNumber)

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])

  return minimalBuildNumber
}

export const useMustUpdateApp = () => {
  const minimalBuildNumber = useMinimalBuildNumber()
  return !!minimalBuildNumber && build < minimalBuildNumber
}
