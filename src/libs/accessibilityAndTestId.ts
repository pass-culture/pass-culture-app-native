/** RN is having a bug that make e2e testing complicated, this is why we use accessibilityLabel as testID first, otherwise wording
 * Don't change that
 * Read more https://stackoverflow.com/questions/64706072/how-to-set-the-testid-and-the-accessibilitylabel-together-with-react-native
 */
export function accessibilityAndTestId(accessibilityLabel?: string, testID?: string) {
  return {
    accessible: !!accessibilityLabel,
    accessibilityLabel,
    testID: accessibilityLabel || testID,
  }
}
