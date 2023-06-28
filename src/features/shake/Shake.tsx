import { useNavigation } from '@react-navigation/native'
import { useEffect, useState, useCallback } from 'react'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import RNShake from 'react-native-shake'
import Sound from 'react-native-sound'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'

// Enable playback in silence mode
Sound.setCategory('Playback')

const marion = new Sound('marion3.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.error('failed to load the sound', error)
    return
  }
})

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
}

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
      ReactNativeHapticFeedback.trigger('impactMedium', options)
      marion.setVolume(1)
      marion.play()
      navigateInternal()
    })

    return () => {
      subscription.remove()
    }
  }, [navigateInternal])

  return null
}
