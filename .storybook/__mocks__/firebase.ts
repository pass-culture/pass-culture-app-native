// --- App ---
export const initializeApp = () => ({})
export const getApp = () => ({})

// --- Remote Config ---
export const getRemoteConfig = () => ({})

// --- Analytics ---
export const getAnalytics = () => ({})
export const getAppInstanceId = () => {}
export const logEvent = () => {}
export const setAnalyticsCollectionEnabled = () => {}
export const setDefaultEventParameters = () => {}
export const setUserId = () => {}

// --- Firestore ---
export const getFirestore = () => ({})
export const initializeFirestore = () => ({})
export const persistentLocalCache = () => ({})
export const persistentMultipleTabManager = () => ({})
export const enableNetwork = () => {}
export const disableNetwork = () => {}

export const collection = () => ({})
export const doc = () => ({})

export const getDoc = () => {}
export const setDoc = () => {}
export const updateDoc = () => {}
export const deleteDoc = () => {}

export const onSnapshot = (ref: any, callback: any) => {
  callback({ data: () => {}, get: () => {} })
  return () => {}
}
