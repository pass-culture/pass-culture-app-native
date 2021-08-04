// To handle the "deeplink" expperience of the app on the web,
// we rely only on the `linking` config object passed to NavigationContainer,
// so this hook is useless on the web.
export function useListenDeepLinksEffect() {
  // do nothing
}
