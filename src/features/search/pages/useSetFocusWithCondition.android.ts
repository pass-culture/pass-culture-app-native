import { MutableRefObject, useEffect } from 'react'
import { TextInput as RNTextInput } from 'react-native'

export const useSetFocusWithCondition = (
  shouldFocus: boolean,
  textInput: MutableRefObject<RNTextInput | null>
) => {
  useEffect(() => {
    if (shouldFocus) {
      // Without timeout the focus is ok but the keyboard not open
      globalThis.setTimeout(() => textInput.current?.focus())
    }
  }, [shouldFocus, textInput])
}
