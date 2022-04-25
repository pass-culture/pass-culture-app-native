// eslint-disable-next-line no-restricted-imports
import { getAnalytics } from 'firebase/analytics'

import { getFirebaseApp } from 'libs/firebase/app'

const firebaseApp = getFirebaseApp()
// @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
const firebaseAnalytics = getAnalytics(firebaseApp)

export default () => ({
  // @ts-ignore Not existing on the web
  setDefaultEventParameters(_params: Record<string, string> | undefined) {
    // mock as not present on the web
  },
  ...firebaseAnalytics,
})
