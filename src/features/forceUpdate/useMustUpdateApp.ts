import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

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

  if (Platform.OS === 'web') {
    // TODO: This block is Web only and will be removed very soon after PC-10931
    // eslint-disable-next-line no-console
    console.log('useMustUpdateApp', {
      minimalBuildNumber,
      build,
      mustUpdateApp: !!minimalBuildNumber && build < minimalBuildNumber,
    })
  }
  return !!minimalBuildNumber && build < minimalBuildNumber
}
