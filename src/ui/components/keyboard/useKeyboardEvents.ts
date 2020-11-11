// based on https://github.com/react-native-community/hooks/blob/master/src/useKeyboard.ts
import { useEffect } from 'react'
import { Keyboard, KeyboardEventListener, ScreenRect, Platform } from 'react-native'

interface UseKeyboardReturnData {
  keyboardShown: boolean
  keyboardHeight: number
  coordinates: {
    start: ScreenRect
    end: ScreenRect
  }
}

export interface UseKeyboardEventsConfig {
  onBeforeShow: (keyboard: UseKeyboardReturnData) => void
  onBeforeHide: (keyboard: UseKeyboardReturnData) => void
}

export const useKeyboardEvents = ({ onBeforeShow, onBeforeHide }: UseKeyboardEventsConfig) => {
  const handleKeyboardWillShow: KeyboardEventListener = (e) => {
    const newCoordinates = { start: e.startCoordinates, end: e.endCoordinates }
    const newKeyboardHeight = newCoordinates.end.height
    onBeforeShow({
      keyboardShown: true,
      keyboardHeight: newKeyboardHeight,
      coordinates: newCoordinates,
    })
  }
  const handleKeyboardDidShow: KeyboardEventListener = (e) => {
    /**
     * On iOS, keyboardDidShow executes when the keyboard has finished appearing.
     * On Android, keyboardWillShow does not exist and keyboardDidShow is then used https://github.com/facebook/react-native/issues/3468
     */
    if (Platform.OS === 'android') {
      handleKeyboardWillShow(e)
      return
    }
    // If needed, implement iOS behavior here
  }
  const handleKeyboardWillHide: KeyboardEventListener = (e) => {
    const newCoordinates = { start: e.startCoordinates, end: e.endCoordinates }
    const newKeyboardHeight = newCoordinates.end.height
    onBeforeHide({
      keyboardShown: false,
      keyboardHeight: newKeyboardHeight,
      coordinates: newCoordinates,
    })
  }
  const handleKeyboardDidHide: KeyboardEventListener = (e) => {
    /**
     * On iOS, keyboardDidHide executes when the keyboard has finished hiding.
     * On Android, keyboardWillHide does not exist and keyboardDidHide is then used https://github.com/facebook/react-native/issues/3468
     */
    if (Platform.OS === 'android') {
      handleKeyboardWillHide(e)
      return
    }
    // If needed, implement iOS behavior here
  }
  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow)
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow)
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide)
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide)
    return () => {
      Keyboard.removeListener('keyboardWillShow', handleKeyboardWillShow)
      Keyboard.removeListener('keyboardDidShow', handleKeyboardDidShow)
      Keyboard.removeListener('keyboardWillHide', handleKeyboardWillHide)
      Keyboard.removeListener('keyboardDidHide', handleKeyboardDidHide)
    }
  }, [onBeforeHide, onBeforeShow])
}
