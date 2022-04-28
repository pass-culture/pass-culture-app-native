// eslint-disable-next-line no-restricted-imports
import firebase from 'firebase/compat/app'
// eslint-disable-next-line no-restricted-imports
import 'firebase/compat/firestore'

import initializeApp from '../firebase-init'
initializeApp()

const firestore = firebase.firestore
export default firestore
