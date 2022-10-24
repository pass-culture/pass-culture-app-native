import { MutableRefObject, useEffect } from 'react'
import { TextInput as RNTextInput } from 'react-native'

export const useSetFocusWithCondition = (
  shouldFocus: boolean,
  textInputRef: MutableRefObject<RNTextInput | null>
) => {
  useEffect(() => {
    if (shouldFocus) {
      textInputRef.current?.focus()
    }
  }, [shouldFocus, textInputRef])
}
