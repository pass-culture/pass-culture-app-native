import { useEffect, useState } from 'react'
import { Linking, Platform } from 'react-native'

import { eventMonitoring } from 'libs/monitoring'

export const useIsMailAppAvailable = (): boolean => {
  const [isMailAppAvailable, setIsMailAppAvailable] = useState<boolean>(Platform.OS === 'android')

  useEffect(() => {
    if (Platform.OS === 'android') return

    const checkMailAppAvailability = async () => {
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
    }

    checkMailAppAvailability()
  }, [])

  return isMailAppAvailable
}

const emailAppLinks = [
  'message://',
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
]
