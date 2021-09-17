import { useEffect, useState } from 'react'

import { minimalBuildNumberStatusListener } from 'libs/firestore/applicationVersions'

import Package from '../../../package.json'

const useMinimalBuildNumber = (setMinimalBuildNumber: (minimalBuildNumber: number) => void) => {
  useEffect(() => {
    const subscriber = minimalBuildNumberStatusListener(setMinimalBuildNumber)

    // Stop listening for updates when no longer required
    return () => subscriber()
  }, [])
}

export const useMustUpdateApp = (): boolean => {
  const [minimalBuildNumber, setMinimalBuildNumber] = useState<number | null>(null)

  useMinimalBuildNumber(setMinimalBuildNumber)

  return !!minimalBuildNumber && Package.build < minimalBuildNumber
}
