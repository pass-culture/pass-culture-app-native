// import { useEffect } from 'react'
// import { Linking } from 'react-native'

// import { useDeeplinkUrlHandler, useOnDeeplinkError } from './useDeeplinkUrlHandler'

// To handle the "deeplink" expperience of the app on android,
// we rely only on the `linking` config object passed to NavigationContainer,
// so this hook is useless on android.
export function useListenDeepLinksEffect() {
  // do nothing
}

// export function useListenDeepLinksEffect() {
//   const onError = useOnDeeplinkError()
//   const handleDeeplinkUrl = useDeeplinkUrlHandler()

//   useEffect(() => {
//     Linking.getInitialURL()
//       .catch(onError)
//       .then((url) => {
//         if (url === null) {
//           // Android/iOS can return null when opening the app from certains places
//           // in this case, it's not en error, just ignore it.
//           return
//         }

//         if (url) {
//           handleDeeplinkUrl({ url })
//         } else {
//           onError()
//         }
//       })
//     Linking.addEventListener('url', handleDeeplinkUrl)
//     return () => Linking.removeEventListener('url', handleDeeplinkUrl)
//   }, [])
// }
