import { useEffect, useState } from 'react'
import { Linking } from 'react-native'

export const useIsMailAppAvailableIOS = (): boolean => {
  const [isMailAppAvailable, setIsMailAppAvailable] = useState<boolean>(false)

  const checkMailAppAvailability = async () => {
    try {
      for (const emailAppLink of emailLinks) {
        try {
          if (await Linking.canOpenURL(emailAppLink)) {
            console.log('avail on', emailAppLink)
            setIsMailAppAvailable(true)
            return
          }
        } catch (error) {
          console.log('NOT avail on', emailAppLink)
        }
      }

      setIsMailAppAvailable(false)
    } catch (error) {
      console.error('Error checking mail app availability:', error)
      setIsMailAppAvailable(false)
    }
  }

  useEffect(() => {
    checkMailAppAvailability()
  }, [])

  return isMailAppAvailable
}

const emailLinks = [
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
  'message://', // Check last because
]
