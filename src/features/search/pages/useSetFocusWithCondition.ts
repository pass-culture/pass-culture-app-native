import { MutableRefObject, useEffect } from 'react'
import { TextInput as RNTextInput } from 'react-native'

export const useSetFocusWithCondition = (
  shouldFocus: boolean,
  textInput: MutableRefObject<RNTextInput | null>
) => {
  useEffect(() => {
    if (shouldFocus) {
      textInput.current?.focus()
    }
  }, [shouldFocus, textInput])
}
