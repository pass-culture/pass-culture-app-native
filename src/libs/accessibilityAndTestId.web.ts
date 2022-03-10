export function accessibilityAndTestId(accessibilityLabel?: string, testID?: string) {
  return {
    accessible: true,
    accessibilityLabel,
    testID: testID || accessibilityLabel,
    // necessary if components are not React Native Web such as <button>
    ['data-testid']: testID || accessibilityLabel,
    ['aria-label']: accessibilityLabel,
  }
}
