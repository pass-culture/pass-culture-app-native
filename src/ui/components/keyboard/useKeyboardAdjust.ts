import { useEffect } from 'react'
import { Platform } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'

export const useKeyboardAdjust = () => {
  useEffect(() => {
    // This prevents the navbar and the filter button to 'jump' above the keyboard
    // when we open the keyboard. Thus Android and iOS have the same behaviour
    if (Platform.OS === 'android') AndroidKeyboardAdjust.setAdjustNothing()
    return () => Platform.OS === 'android' && AndroidKeyboardAdjust.setAdjustResize()
  }, [])
}
