import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import React from 'react'
import RNShake from 'react-native-shake'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

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

  return <ButtonPrimary wording="shake" onPress={() => navigate('ShakePage')} />
}
