import { useNavigation } from '@react-navigation/native'
import { useEffect, useState, useCallback } from 'react'
import RNShake from 'react-native-shake'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export const Shake = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const [good, setGood] = useState(true)

  const navigateInternal = useCallback(() => {
    setGood((good) => !good)
    if (good) navigate('ShakeStart')
    else navigate('ShakeNoRetry')
  }, [navigate, good])

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      navigateInternal()
    })

    return () => {
      subscription.remove()
    }
  }, [navigateInternal])

  return null
}
