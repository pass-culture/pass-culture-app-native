// eslint-disable-next-line no-restricted-imports
import { getFirestore } from 'firebase/firestore'

import { getFirebaseApp } from 'libs/firebase/app'

// @ts-ignore TODO(LucasBeneston): native
export default () => getFirestore(getFirebaseApp())
