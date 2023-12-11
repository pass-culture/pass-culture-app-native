import { useEffect, useState, useCallback } from 'react'
import { Linking, Platform } from 'react-native'

import { eventMonitoring } from 'libs/monitoring'

export const useIsMailAppAvailable = (): boolean => {
  const isAndroid = Platform.OS === 'android'
  const [isMailAppAvailable, setIsMailAppAvailable] = useState<boolean>(isAndroid)

  const checkMailAppAvailability = useCallback(async () => {
    if (isAndroid) return
    try {
      for (const emailAppLink of emailAppLinks) {
        if (await Linking.canOpenURL(emailAppLink)) {
          setIsMailAppAvailable(true)
          return
        }
      }
    } catch (error) {
      eventMonitoring.captureException(`Error checking mail app availability: ${error}`)
    }
  }, [isAndroid])

  useEffect(() => {
    checkMailAppAvailability()
  }, [checkMailAppAvailability])

  return isMailAppAvailable
}

const emailAppLinks = [
  'googlegmail://',
  'inbox-gmail://',
  'readdle-spark://',
  'airmail://',
  'ms-outlook://',
  'ymail://',
  'superhuman://',
  'yandexmail://',
  'fastmail://',
  'protonmail://',
  'message://',
]
