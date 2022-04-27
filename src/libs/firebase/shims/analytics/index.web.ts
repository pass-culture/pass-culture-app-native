// eslint-disable-next-line no-restricted-imports
import firebase from 'firebase/compat/app'
// eslint-disable-next-line no-restricted-imports
import 'firebase/compat/analytics'

import initializeApp from '../firebase-init'
initializeApp()

const analytics = firebase.analytics
export default analytics
