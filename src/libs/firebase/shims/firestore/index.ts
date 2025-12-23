/* eslint-disable no-restricted-imports */
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
export type DocumentData = FirebaseFirestoreTypes.DocumentData
export type DocumentSnapshot<
  T extends FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData,
> = FirebaseFirestoreTypes.DocumentSnapshot<T>
export {
  doc,
  getDoc,
  disableNetwork,
  enableNetwork,
  getFirestore,
} from '@react-native-firebase/firestore'
/* eslint-enable no-restricted-imports */
