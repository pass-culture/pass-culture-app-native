import { getFirebaseApp } from 'libs/firebase/app/getFirebaseApp'

const firebaseAnalytics = getFirebaseApp().analytics()

export default () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDefaultEventParameters(params: Record<string, string> | undefined) {
    // mock as not present on the web
  },
  ...firebaseAnalytics,
})
