// We need to define this unused empty component in order to compile web app correctly. Without it,
// the native component ArtistWebview.tsx which uses a Webview makes web compilation fail.
export const ArtistWebview = () => {
  return null
}
