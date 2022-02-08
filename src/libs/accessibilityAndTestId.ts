export function accessibilityAndTestId(accessibilityLabel?: string, testID?: string) {
  return {
    accessible: !!accessibilityLabel,
    accessibilityLabel,
    testID: testID || accessibilityLabel,
  }
}
