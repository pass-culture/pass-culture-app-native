import { env } from 'libs/environment/env'

export const FIREBASE_CONFIG = {
  apiKey: env.FIREBASE_API_PUBLIC_KEY,
  authDomain: env.FIREBASE_AUTHDOMAIN,
  projectId: env.FIREBASE_PROJECTID,
  storageBucket: env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: env.FIREBASE_MESSAGINGSENDERID,
  appId: env.FIREBASE_APPID,
}
