import { useState, useEffect } from 'react'
import CodePush from 'react-native-code-push'

import { eventMonitoring } from 'libs/monitoring'

export function useCodePushVersion() {
  const [versionLabel, setVersionLabel] = useState('')

  useEffect(() => {
    async function getVersionLabel() {
      try {
        const metadata = await CodePush.getUpdateMetadata()

        if (!metadata) {
          return
        }
        setVersionLabel(metadata.label)
      } catch (error) {
        eventMonitoring.captureException(error)
      }
    }
    getVersionLabel()
  }, [])

  return versionLabel
}
