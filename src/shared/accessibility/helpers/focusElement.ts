import { AccessibilityInfo, findNodeHandle, Platform, View } from 'react-native'

export const focusElement = (ref: React.RefObject<View | null>) => {
  if (Platform.OS === 'web') {
    const element = ref.current as unknown as HTMLElement | null
    if (typeof element?.focus === 'function') {
      element.focus()
    }
    return
  }

  const reactTag = findNodeHandle(ref.current)
  if (reactTag) AccessibilityInfo.setAccessibilityFocus(reactTag)
}
