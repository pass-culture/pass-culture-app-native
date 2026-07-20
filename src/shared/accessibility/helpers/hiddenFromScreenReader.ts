import { AccessibilityProps } from 'react-native'

export function hiddenFromScreenReader(): AccessibilityProps {
  return {
    accessible: false, // Global
    accessibilityElementsHidden: true, // iOS
    importantForAccessibility: 'no', // Android
  }
}
