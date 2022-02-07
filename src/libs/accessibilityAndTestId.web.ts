export function accessibilityAndTestId(id: string) {
  return { accessible: true, accessibilityLabel: id, testID: id }
}
