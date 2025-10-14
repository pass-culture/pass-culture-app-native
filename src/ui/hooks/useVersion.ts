import { HotUpdater } from '@hot-updater/react-native'
import { useState, useEffect } from 'react'

import { eventMonitoring } from 'libs/monitoring/services'
import { getAppVersion } from 'libs/packageJson'

export function useVersion() {
  const [hotUpdaterLabel, setHotUpdaterLabel] = useState('')

  useEffect(() => {
    async function getHotUpdaterLabel() {
      try {
        const metadata = await HotUpdater.getBundleId()

        if (!metadata) {
          return
        }
        setHotUpdaterLabel(metadata)
      } catch (error) {
        eventMonitoring.captureException(error)
      }
    }
    getHotUpdaterLabel()
  }, [])

  // for Hot Updater we take the last 4 digits of the bundle id
  const shortHotUpdaterLabel = hotUpdaterLabel.slice(-4)

  let version = `Version\u00A0${getAppVersion()}`
  if (hotUpdaterLabel && shortHotUpdaterLabel !== '0000') version += `-${shortHotUpdaterLabel}`

  return version
}
