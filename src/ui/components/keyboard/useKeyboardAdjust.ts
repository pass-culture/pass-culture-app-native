import { useFocusEffect } from '@react-navigation/native'
import { Platform } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'

export const useKeyboardAdjust = () => {
  useFocusEffect(() => {
    // This prevents the navbar and the filter button to 'jump' above the keyboard
    // when we open the keyboard. Thus Android and iOS have the same behaviour
    if (Platform.OS === 'android') AndroidKeyboardAdjust.setAdjustNothing()
    // We want to cancel the `setAdjustNothing()` when we leave a screen.
    // We rely on the fact that `useFocusEffect` run its return callback on blur.
    // Reminder : react-navigation does not unmount screens.
    return () => Platform.OS === 'android' && AndroidKeyboardAdjust.setAdjustResize()
  })
}
