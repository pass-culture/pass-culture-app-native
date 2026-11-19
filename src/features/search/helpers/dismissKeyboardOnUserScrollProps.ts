import { Keyboard, Platform, ScrollViewProps } from 'react-native'

const dismissKeyboard = () => Keyboard.dismiss()

export const dismissKeyboardOnUserScrollProps: Pick<ScrollViewProps, 'onScroll' | 'onTouchMove'> =
  Platform.select({
    web: { onTouchMove: dismissKeyboard },
    default: { onScroll: dismissKeyboard },
  })
