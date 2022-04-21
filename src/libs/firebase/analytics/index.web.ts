import { getFirebaseApp } from 'libs/firebase/app'

const firebaseAnalytics = getFirebaseApp().analytics()

export default () => ({
  // @ts-ignore Not existing on the web
  setDefaultEventParameters(_params: Record<string, string> | undefined) {
    // mock as not present on the web
  },
  ...firebaseAnalytics,
})
