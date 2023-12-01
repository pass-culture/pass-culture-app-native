import { captureException } from '@sentry/react-native'
import { useEffect, useState } from 'react'
import { Linking } from 'react-native'

export const useIsMailAppAvailableIOS = (): boolean => {
  const [isAnyMailAppAvailable, setIsAnyMailAppAvailable] = useState<boolean>(false)

  const checkMailAppAvailability = async () => {
    try {
      for (const emailAppLink of emailAppLinks) {
        if (await Linking.canOpenURL(emailAppLink)) {
          setIsAnyMailAppAvailable(true)
          return
        }
      }
      setIsAnyMailAppAvailable(false)
    } catch (error) {
      captureException(`Error checking mail app availability: ${error}`)
      setIsAnyMailAppAvailable(false)
    }
  }

  useEffect(() => {
    checkMailAppAvailability()
  }, [])

  return isAnyMailAppAvailable
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
