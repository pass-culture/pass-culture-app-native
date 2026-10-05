import React from 'react'
import { Platform } from 'react-native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'

export function SearchSuggestionsStatus({ id, message }: { id: string; message: string }) {
  if (Platform.OS !== 'web') return null

  return (
    <HiddenAccessibleText
      nativeID={id}
      accessibilityRole={AccessibilityRole.STATUS}
      accessibilityAtomic>
      {message}
    </HiddenAccessibleText>
  )
}
