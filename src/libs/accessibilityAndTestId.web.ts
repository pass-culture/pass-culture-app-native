export function accessibilityAndTestId(accessibilityLabel?: string, testID?: string) {
  return {
    accessible: true,
    accessibilityLabel,
    testID: accessibilityLabel || testID,
    // necessary if components are not React Native Web such as <button>
    ['data-testid']: accessibilityLabel || testID,
    ['aria-label']: accessibilityLabel,
  }
}
