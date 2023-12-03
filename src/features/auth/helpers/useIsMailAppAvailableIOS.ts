import { captureException } from '@sentry/react-native'
import { useEffect, useState } from 'react'
import { Linking } from 'react-native'

export const useIsMailAppAvailableIOS = (): boolean => {
  const [isMailAppAvailable, setIsMailAppAvailable] = useState<boolean>(false)

  const checkMailAppAvailability = async () => {
    try {
      for (const emailAppLink of emailAppLinks) {
        if (await Linking.canOpenURL(emailAppLink)) {
          setIsMailAppAvailable(true)
          return
        }
      }
      setIsMailAppAvailable(false)
    } catch (error) {
      captureException(`Error checking mail app availability: ${error}`)
      setIsMailAppAvailable(false)
    }
  }

  useEffect(() => {
    checkMailAppAvailability()
  }, [])

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
