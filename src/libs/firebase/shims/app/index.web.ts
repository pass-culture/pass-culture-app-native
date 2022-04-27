// eslint-disable-next-line no-restricted-imports
import firebase from 'firebase/compat/app'

import initializeApp from '../firebase-init'
initializeApp()

const app = firebase.app()
export default app
