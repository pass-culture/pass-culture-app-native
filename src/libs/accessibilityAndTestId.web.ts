/** RN is having a bug that make e2e testing complicated, this is why we use accessibilityLabel as testID first, otherwise wording
 * Don't change that
 * https://stackoverflow.com/questions/64706072/how-to-set-the-testid-and-the-accessibilitylabel-together-with-react-native
 */
export function accessibilityAndTestId(accessibilityLabel?: string, testID?: string) {
  return {
    accessibilityLabel,
    testID: accessibilityLabel || testID,
    // necessary if components are not React Native Web such as <button>
    ['data-testid']: accessibilityLabel || testID,
    ['aria-label']: accessibilityLabel,
  }
}
