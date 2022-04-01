import { getFirebaseApp } from 'libs/firebase/app'

const firebaseAnalytics = getFirebaseApp().analytics()

export default () => ({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // @ts-ignore Not existing on the web
  setDefaultEventParameters(params: Record<string, string> | undefined) {
    // mock as not present on the web
  },
  ...firebaseAnalytics,
})
