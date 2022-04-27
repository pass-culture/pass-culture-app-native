// eslint-disable-next-line no-restricted-imports
import firebase from 'firebase/compat/app'
// eslint-disable-next-line no-restricted-imports
import 'firebase/compat/firestore'

import initializeApp from '../firebase-init'
initializeApp()

const firestore = firebase.firestore

// Want to do local development?
// Uncomment this and use `yarn test:emulator:start`
// firestore().useEmulator('http://localhost:8080');

export default firestore
