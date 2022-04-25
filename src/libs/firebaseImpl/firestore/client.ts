// eslint-disable-next-line no-restricted-imports
import { getFirestore } from 'firebase/firestore'

import { getFirebaseApp } from 'libs/firebase/app'

// @ts-ignore TODO(LucasBeneston): Fix typing after update @react-native-firebase/app
export const firestoreRemoteStore = getFirestore(getFirebaseApp())
