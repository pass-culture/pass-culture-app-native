import React from 'react'
import { TextInput as RNTextInput } from 'react-native'

type Value = React.ComponentProps<typeof RNTextInput>['value']

export function isValueEmpty(value: Value): boolean {
  if (value && value.trim().length > 0) {
    return false
  }
  return true
}
