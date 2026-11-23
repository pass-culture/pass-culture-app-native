import { RefObject, useEffect } from 'react'
import { Text, View } from 'react-native'

import { focusElement } from 'shared/accessibility/helpers/focusElement'

const FOCUS_DELAY_MS = 150

export const useFocusOnMount = (ref: RefObject<View | Text | null>) => {
  useEffect(
    function focusOnMount() {
      const timer = setTimeout(() => focusElement(ref), FOCUS_DELAY_MS)
      return () => clearTimeout(timer)
    },
    [ref]
  )
}
