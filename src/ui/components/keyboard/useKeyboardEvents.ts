// based on https://github.com/react-native-community/hooks/blob/master/src/useKeyboard.ts
import { useEffect } from 'react'
import { Keyboard, KeyboardEventListener, KeyboardMetrics, Platform } from 'react-native'

interface UseKeyboardReturnData {
  keyboardShown: boolean
  keyboardHeight: number
  coordinates: {
    start: KeyboardMetrics | undefined
    end: KeyboardMetrics | undefined
  }
}

interface UseKeyboardEventsConfig {
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
    }
    // If needed, implement iOS behavior here
  }
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow)
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow)
    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide)
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide)

    return () => {
      keyboardWillShow.remove()
      keyboardDidShow.remove()
      keyboardWillHide.remove()
      keyboardDidHide.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBeforeHide, onBeforeShow])
}

export const useForHeightKeyboardEvents = (setKeyboardHeight: (height: number) => void) => {
  return useKeyboardEvents({
    onBeforeShow(data) {
      if (data.keyboardShown) {
        setKeyboardHeight(data.keyboardHeight)
      }
    },
    onBeforeHide(data) {
      if (!data.keyboardShown) {
        setKeyboardHeight(0)
      }
    },
  })
}
