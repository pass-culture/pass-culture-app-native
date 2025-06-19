// eslint-disable-next-line local-rules/no-useless-hook
export const useScreenRenderOnFocus = (_screenName: string) => {
  // perf().startScreenTrace not available on iOS
  // https://rnfirebase.io/perf/usage#custom-screen-traces
  // no measure of screen render performance on web
}
