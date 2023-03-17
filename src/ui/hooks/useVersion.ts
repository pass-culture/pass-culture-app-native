import { useState, useEffect } from 'react'
import CodePush from 'react-native-code-push'

import { eventMonitoring } from 'libs/monitoring'

import Package from '../../../package.json'

export function useVersion() {
  const [codePushLabel, setCodePushLabel] = useState('')

  useEffect(() => {
    async function getcodePushLabel() {
      try {
        const metadata = await CodePush.getUpdateMetadata()

        if (!metadata) {
          return
        }
        setCodePushLabel(metadata.label)
      } catch (error) {
        eventMonitoring.captureException(error)
      }
    }
    getcodePushLabel()
  }, [])

  // exemple Code Push format : 'v3875' => '3875'
  const shortCodePushLabel = codePushLabel.substring(1)

  let version = `Version\u00A0${Package.version}`
  if (codePushLabel) version += `-${shortCodePushLabel}`

  return version
}
