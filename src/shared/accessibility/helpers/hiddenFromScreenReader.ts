import { AccessibilityProps } from 'react-native'

export function hiddenFromScreenReader(): AccessibilityProps {
  return {
    accessibilityElementsHidden: true, // iOS
    importantForAccessibility: 'no', // Android
  }
}
