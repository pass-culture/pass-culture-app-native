import { getFirebaseApp } from 'libs/firebase/app'

export default () => getFirebaseApp().firestore()
