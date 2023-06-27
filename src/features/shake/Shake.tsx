import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import RNShake from 'react-native-shake'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export const Shake = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      navigate('ShakePage')
    })

    return () => {
      subscription.remove()
    }
  }, [navigate])

  return null
}
